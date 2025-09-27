// Gmail API integration service
// Note: This requires Gmail API setup and OAuth2 authentication

class GmailService {
  constructor() {
    this.apiKey = process.env.REACT_APP_GMAIL_API_KEY;
    this.clientId = process.env.REACT_APP_GMAIL_CLIENT_ID;
    this.discoveryDoc = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';
    this.gapi = null;
    this.isInitialized = false;
  }

  // Initialize Gmail API
  async init() {
    try {
      // Load Gmail API
      await this.loadGmailAPI();
      
      // Check if gapi is available
      if (!this.gapi || !this.gapi.client) {
        throw new Error('Gmail API not loaded properly');
      }
      
      // Initialize the API client
      await this.gapi.client.init({
        apiKey: this.apiKey,
        clientId: this.clientId,
        discoveryDocs: [this.discoveryDoc],
        scope: 'https://www.googleapis.com/auth/gmail.readonly'
      });

      console.log('Gmail API initialized');
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing Gmail API:', error);
      this.isInitialized = false;
      return false;
    }
  }

  // Load Gmail API script
  loadGmailAPI() {
    return new Promise((resolve, reject) => {
      // Check if gapi is already loaded
      if (window.gapi && window.gapi.client) {
        this.gapi = window.gapi;
        resolve();
        return;
      }

      // Check if script is already being loaded
      if (document.querySelector('script[src="https://apis.google.com/js/api.js"]')) {
        // Wait for existing script to load
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait
        const checkGapi = () => {
          if (window.gapi && window.gapi.client) {
            this.gapi = window.gapi;
            resolve();
          } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(checkGapi, 100);
          } else {
            reject(new Error('Gmail API script loading timeout'));
          }
        };
        checkGapi();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      
      script.onload = () => {
        try {
          if (window.gapi) {
            this.gapi = window.gapi;
            this.gapi.load('client', () => {
              if (this.gapi && this.gapi.client) {
                resolve();
              } else {
                reject(new Error('Failed to load Gmail client'));
              }
            });
          } else {
            reject(new Error('Gmail API script loaded but gapi is undefined'));
          }
        } catch (error) {
          reject(new Error(`Gmail API initialization error: ${error.message}`));
        }
      };
      
      script.onerror = (error) => {
        reject(new Error('Failed to load Gmail API script - check internet connection'));
      };
      
      // Add error handling for script loading
      script.onabort = () => {
        reject(new Error('Gmail API script loading was aborted'));
      };
      
      document.head.appendChild(script);
    });
  }

  // Authenticate user
  async authenticate() {
    try {
      const authInstance = this.gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();
      return user;
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  }

  // Get user's emails
  async getEmails(maxResults = 10) {
    try {
      const response = await this.gapi.client.gmail.users.messages.list({
        userId: 'me',
        maxResults: maxResults,
        q: 'in:inbox' // Only inbox emails
      });

      const messages = response.result.messages || [];
      const emails = [];

      // Fetch full email details
      for (const message of messages) {
        try {
          const email = await this.getEmailDetails(message.id);
          if (email) {
            emails.push(email);
          }
        } catch (error) {
          console.error(`Error fetching email ${message.id}:`, error);
        }
      }

      return emails;
    } catch (error) {
      console.error('Error fetching emails:', error);
      throw error;
    }
  }

  // Get detailed email information
  async getEmailDetails(messageId) {
    try {
      const response = await this.gapi.client.gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full'
      });

      const message = response.result;
      const headers = message.payload.headers;
      
      // Extract email details
      const getHeader = (name) => {
        const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
        return header ? header.value : '';
      };

      const subject = getHeader('Subject');
      const from = getHeader('From');
      const date = getHeader('Date');
      const body = this.extractEmailBody(message.payload);

      return {
        id: messageId,
        subject,
        body,
        from,
        date: new Date(date).toISOString(),
        threadId: message.threadId
      };
    } catch (error) {
      console.error(`Error fetching email details for ${messageId}:`, error);
      return null;
    }
  }

  // Extract email body from payload
  extractEmailBody(payload) {
    let body = '';

    if (payload.body && payload.body.data) {
      // Single part message
      body = this.decodeBase64(payload.body.data);
    } else if (payload.parts) {
      // Multi-part message
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body && part.body.data) {
          body += this.decodeBase64(part.body.data);
        } else if (part.mimeType === 'text/html' && part.body && part.body.data) {
          // Strip HTML tags for plain text
          const htmlBody = this.decodeBase64(part.body.data);
          body += this.stripHtml(htmlBody);
        } else if (part.parts) {
          // Nested parts
          body += this.extractEmailBody(part);
        }
      }
    }

    return body.trim();
  }

  // Decode base64 data
  decodeBase64(data) {
    try {
      return atob(data.replace(/-/g, '+').replace(/_/g, '/'));
    } catch (error) {
      console.error('Error decoding base64:', error);
      return '';
    }
  }

  // Strip HTML tags
  stripHtml(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }

  // Search emails with specific query
  async searchEmails(query, maxResults = 10) {
    try {
      const response = await this.gapi.client.gmail.users.messages.list({
        userId: 'me',
        maxResults: maxResults,
        q: query
      });

      const messages = response.result.messages || [];
      const emails = [];

      for (const message of messages) {
        try {
          const email = await this.getEmailDetails(message.id);
          if (email) {
            emails.push(email);
          }
        } catch (error) {
          console.error(`Error fetching email ${message.id}:`, error);
        }
      }

      return emails;
    } catch (error) {
      console.error('Error searching emails:', error);
      throw error;
    }
  }

  // Check if service is properly configured
  isConfigured() {
    return !!(this.apiKey && this.clientId);
  }

  // Check if user is authenticated
  isAuthenticated() {
    try {
      if (!this.isInitialized || !this.gapi) {
        return false;
      }
      const authInstance = this.gapi.auth2.getAuthInstance();
      return authInstance.isSignedIn.get();
    } catch (error) {
      return false;
    }
  }

  // Sign out
  async signOut() {
    try {
      const authInstance = this.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
}

// Create singleton instance
export const gmailService = new GmailService();

// Utility function to integrate with email parser
export const fetchAndParseEmails = async (emailParser, maxResults = 10) => {
  try {
    // Initialize Gmail service
    const initialized = await gmailService.init();
    if (!initialized) {
      throw new Error('Failed to initialize Gmail API');
    }

    // Authenticate user
    await gmailService.authenticate();
    
    // Check if authenticated
    if (!gmailService.isAuthenticated()) {
      throw new Error('User not authenticated');
    }

    // Fetch emails
    const emails = await gmailService.getEmails(maxResults);
    
    // Parse emails
    const parsedEmails = emailParser.parseEmails(emails);
    
    return {
      emails,
      parsedEmails,
      timeRelatedEmails: parsedEmails.filter(email => email.hasTimeInfo)
    };
  } catch (error) {
    console.error('Error fetching and parsing emails:', error);
    throw error;
  }
};
