import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    this.genAI = null;
    this.model = null;
    this.isConfigured = false;
    
    if (this.apiKey) {
      this.initialize();
    }
  }

  initialize() {
    try {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      this.isConfigured = true;
      console.log('Gemini AI initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
      this.isConfigured = false;
    }
  }

  // Check if Gemini is properly configured
  isGeminiConfigured() {
    return this.isConfigured && !!this.model;
  }

  // Parse email for time-related information using Gemini AI
  async parseEmailForTimeInfo(email) {
    if (!this.isGeminiConfigured()) {
      throw new Error('Gemini AI not configured. Please add REACT_APP_GEMINI_API_KEY to your .env file.');
    }

    const { subject, body, from, date } = email;
    const emailContent = `Subject: ${subject}\nFrom: ${from}\nDate: ${date}\n\nBody:\n${body}`;

    const prompt = `
Analyze this email and extract any time-related information. Focus on:

1. Due dates, deadlines, or time-sensitive tasks
2. Meeting schedules, appointments, or calls
3. Payment due dates or billing information
4. Assignment deadlines or project timelines
5. Any urgent or time-critical information

Email Content:
${emailContent}

Please respond with a JSON object in this exact format:
{
  "hasTimeInfo": true/false,
  "timeRelatedContent": ["list of time-related phrases found"],
  "summary": {
    "type": "Deadline|Payment|Meeting|Assignment|Urgent|General",
    "priority": "high|medium|low",
    "keyDates": ["extracted dates and times"],
    "description": "brief summary of the time-related information",
    "actionRequired": "what the user needs to do"
  }
}

If no time-related information is found, set hasTimeInfo to false and provide an empty summary.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          ...parsed,
          originalEmail: email,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error('Invalid response format from Gemini');
      }
    } catch (error) {
      console.error('Error parsing email with Gemini:', error);
      throw new Error(`Gemini parsing failed: ${error.message}`);
    }
  }

  // Parse multiple emails
  async parseEmails(emails) {
    if (!this.isGeminiConfigured()) {
      throw new Error('Gemini AI not configured');
    }

    const results = [];
    
    for (const email of emails) {
      try {
        const parsed = await this.parseEmailForTimeInfo(email);
        results.push(parsed);
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error parsing email ${email.id || email.subject}:`, error);
        // Add a fallback result for failed emails
        results.push({
          hasTimeInfo: false,
          timeRelatedContent: [],
          summary: null,
          originalEmail: email,
          timestamp: new Date().toISOString(),
          error: error.message
        });
      }
    }

    return results;
  }

  // Get AI-powered insights about time management
  async getTimeManagementInsights(parsedEmails) {
    if (!this.isGeminiConfigured()) {
      throw new Error('Gemini AI not configured');
    }

    const timeRelatedEmails = parsedEmails.filter(email => email.hasTimeInfo);
    
    if (timeRelatedEmails.length === 0) {
      return {
        insights: "No time-related emails found.",
        recommendations: [],
        upcomingDeadlines: []
      };
    }

    const emailSummaries = timeRelatedEmails.map(email => 
      `${email.summary.type}: ${email.summary.description} (${email.summary.priority} priority)`
    ).join('\n');

    const prompt = `
Based on these time-related emails, provide insights and recommendations:

${emailSummaries}

Please respond with a JSON object:
{
  "insights": "overall analysis of the user's time management situation",
  "recommendations": ["actionable recommendations for better time management"],
  "upcomingDeadlines": ["list of upcoming deadlines or important dates"],
  "priorityActions": ["most urgent actions the user should take"]
}
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid response format from Gemini');
      }
    } catch (error) {
      console.error('Error getting insights from Gemini:', error);
      return {
        insights: "Unable to generate insights at this time.",
        recommendations: [],
        upcomingDeadlines: []
      };
    }
  }

  // Generate smart notifications based on AI analysis
  async generateSmartNotification(parsedEmail) {
    if (!this.isGeminiConfigured() || !parsedEmail.hasTimeInfo) {
      return null;
    }

    const { summary } = parsedEmail;
    
    // Create contextual notification based on AI analysis
    let notificationTitle = '';
    let notificationBody = '';
    
    switch (summary.type) {
      case 'Deadline':
        notificationTitle = `⏰ Deadline Alert: ${parsedEmail.originalEmail.subject}`;
        notificationBody = `${summary.description} - ${summary.actionRequired}`;
        break;
      case 'Payment':
        notificationTitle = `💳 Payment Due: ${parsedEmail.originalEmail.subject}`;
        notificationBody = `${summary.description} - Action: ${summary.actionRequired}`;
        break;
      case 'Meeting':
        notificationTitle = `🤝 Meeting Scheduled: ${parsedEmail.originalEmail.subject}`;
        notificationBody = `${summary.description}`;
        break;
      case 'Assignment':
        notificationTitle = `📝 Assignment Due: ${parsedEmail.originalEmail.subject}`;
        notificationBody = `${summary.description} - ${summary.actionRequired}`;
        break;
      case 'Urgent':
        notificationTitle = `🚨 URGENT: ${parsedEmail.originalEmail.subject}`;
        notificationBody = `${summary.description} - Immediate action required!`;
        break;
      default:
        notificationTitle = `⏰ Time Alert: ${parsedEmail.originalEmail.subject}`;
        notificationBody = `${summary.description}`;
    }

    return {
      title: notificationTitle,
      body: notificationBody,
      priority: summary.priority,
      type: summary.type,
      actionRequired: summary.actionRequired
    };
  }
}

// Create singleton instance
export const geminiService = new GeminiService();

// Utility function to parse emails with Gemini AI
export const parseEmailsWithGemini = async (emails) => {
  try {
    if (!geminiService.isGeminiConfigured()) {
      throw new Error('Gemini AI not configured. Please add REACT_APP_GEMINI_API_KEY to your .env file.');
    }

    const parsedEmails = await geminiService.parseEmails(emails);
    const timeRelatedEmails = parsedEmails.filter(email => email.hasTimeInfo);
    
    return {
      emails,
      parsedEmails,
      timeRelatedEmails,
      insights: await geminiService.getTimeManagementInsights(parsedEmails)
    };
  } catch (error) {
    console.error('Error parsing emails with Gemini:', error);
    throw error;
  }
};
