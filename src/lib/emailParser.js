// Email parsing service for detecting time-related information
export class EmailParser {
  constructor() {
    this.timePatterns = [
      // Date patterns
      /\b(\d{1,2}\/\d{1,2}\/\d{2,4})\b/g,
      /\b(\d{1,2}-\d{1,2}-\d{2,4})\b/g,
      /\b(\d{4}-\d{1,2}-\d{1,2})\b/g,
      /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi,
      /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\.?\s+\d{1,2},?\s+\d{4}\b/gi,
      
      // Time patterns
      /\b(\d{1,2}:\d{2}\s*(AM|PM|am|pm)?)\b/g,
      /\b(\d{1,2}\s*(AM|PM|am|pm))\b/g,
      
      // Relative time patterns
      /\b(tomorrow|today|yesterday|next week|next month|next year|this week|this month|this year)\b/gi,
      /\b(in \d+ days?|in \d+ weeks?|in \d+ months?|in \d+ years?)\b/gi,
      /\b(\d+ days? from now|\d+ weeks? from now|\d+ months? from now)\b/gi,
      
      // Due date patterns
      /\b(due\s+(on|by|before|until)?\s*[^.]*)\b/gi,
      /\b(deadline\s+(is|on|by|before)?\s*[^.]*)\b/gi,
      /\b(submit\s+(by|before|until)?\s*[^.]*)\b/gi,
      /\b(payment\s+(due|by|before|until)?\s*[^.]*)\b/gi,
      /\b(bill\s+(due|by|before|until)?\s*[^.]*)\b/gi,
      
      // Assignment patterns
      /\b(assignment\s+(due|due\s+date|deadline)?\s*[^.]*)\b/gi,
      /\b(homework\s+(due|due\s+date|deadline)?\s*[^.]*)\b/gi,
      /\b(project\s+(due|due\s+date|deadline)?\s*[^.]*)\b/gi,
      /\b(exam\s+(on|date|scheduled)?\s*[^.]*)\b/gi,
      
      // Meeting patterns
      /\b(meeting\s+(on|at|scheduled)?\s*[^.]*)\b/gi,
      /\b(appointment\s+(on|at|scheduled)?\s*[^.]*)\b/gi,
      /\b(call\s+(on|at|scheduled)?\s*[^.]*)\b/gi,
    ];
    
    this.timeKeywords = [
      'due', 'deadline', 'due date', 'submit', 'payment', 'bill', 'assignment',
      'homework', 'project', 'exam', 'meeting', 'appointment', 'call',
      'tomorrow', 'today', 'yesterday', 'next week', 'next month', 'next year'
    ];
  }

  // Parse email content for time-related information
  parseEmail(email) {
    const { subject, body, from, date } = email;
    const fullText = `${subject} ${body}`.toLowerCase();
    
    const timeRelatedContent = this.extractTimeRelatedContent(fullText);
    const summary = this.generateSummary(timeRelatedContent, email);
    
    return {
      hasTimeInfo: timeRelatedContent.length > 0,
      timeRelatedContent,
      summary,
      originalEmail: email
    };
  }

  // Extract time-related content from text
  extractTimeRelatedContent(text) {
    const matches = [];
    
    // Check for time patterns
    this.timePatterns.forEach(pattern => {
      const patternMatches = text.match(pattern);
      if (patternMatches) {
        matches.push(...patternMatches);
      }
    });
    
    // Check for time keywords in context
    this.timeKeywords.forEach(keyword => {
      const keywordRegex = new RegExp(`\\b${keyword}\\b[^.]{0,100}`, 'gi');
      const keywordMatches = text.match(keywordRegex);
      if (keywordMatches) {
        matches.push(...keywordMatches);
      }
    });
    
    // Remove duplicates and clean up
    return [...new Set(matches)].map(match => match.trim());
  }

  // Generate summary of time-related content
  generateSummary(timeRelatedContent, email) {
    if (timeRelatedContent.length === 0) {
      return null;
    }

    const { subject, from } = email;
    const content = timeRelatedContent.join('; ');
    
    // Determine the type of time-related information
    let type = 'General';
    if (content.toLowerCase().includes('due') || content.toLowerCase().includes('deadline')) {
      type = 'Deadline';
    } else if (content.toLowerCase().includes('payment') || content.toLowerCase().includes('bill')) {
      type = 'Payment';
    } else if (content.toLowerCase().includes('assignment') || content.toLowerCase().includes('homework')) {
      type = 'Assignment';
    } else if (content.toLowerCase().includes('meeting') || content.toLowerCase().includes('appointment')) {
      type = 'Meeting';
    }

    return {
      type,
      subject,
      from,
      content,
      timestamp: new Date().toISOString(),
      priority: this.calculatePriority(content, type)
    };
  }

  // Calculate priority based on content urgency
  calculatePriority(content, type) {
    const urgentKeywords = ['urgent', 'asap', 'immediately', 'today', 'tomorrow'];
    const urgentFound = urgentKeywords.some(keyword => 
      content.toLowerCase().includes(keyword)
    );
    
    if (urgentFound) return 'high';
    if (type === 'Payment' || type === 'Deadline') return 'medium';
    return 'low';
  }

  // Parse multiple emails
  parseEmails(emails) {
    return emails.map(email => this.parseEmail(email));
  }
}

// Mock email data for testing
export const mockEmails = [
  {
    id: 1,
    subject: "Assignment Due Tomorrow",
    body: "Your math homework is due tomorrow at 11:59 PM. Please submit it through the online portal.",
    from: "professor@university.edu",
    date: new Date().toISOString()
  },
  {
    id: 2,
    subject: "Payment Reminder",
    body: "Your credit card payment of $150 is due on December 15th, 2024. Please pay before the due date to avoid late fees.",
    from: "billing@creditcard.com",
    date: new Date().toISOString()
  },
  {
    id: 3,
    subject: "Team Meeting Scheduled",
    body: "We have a team meeting scheduled for next Tuesday at 2:00 PM in the conference room. Please prepare your quarterly reports.",
    from: "manager@company.com",
    date: new Date().toISOString()
  },
  {
    id: 4,
    subject: "Project Deadline Extension",
    body: "The project deadline has been extended to January 30th, 2025. This gives us an extra week to complete the final deliverables.",
    from: "project.manager@company.com",
    date: new Date().toISOString()
  },
  {
    id: 5,
    subject: "Regular Newsletter",
    body: "Here's our monthly newsletter with updates about our services and upcoming events.",
    from: "newsletter@company.com",
    date: new Date().toISOString()
  }
];
