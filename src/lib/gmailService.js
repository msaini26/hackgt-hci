class GmailService {
  constructor() {
    this.clientId = process.env.REACT_APP_GMAIL_CLIENT_ID;   // keep your names
    // this.apiKey = process.env.REACT_APP_GMAIL_API_KEY;     // not needed
    this.discoveryDoc = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';

    this.gapi = null;
    this.tokenClient = null;
    this.isInitialized = false;
  }

  async init() {
    try {
      await this.loadScripts(); // load both scripts
      await this.initGapiClient(); // discovery only (no API key needed)
      this.initTokenClient(); // GIS OAuth client
      this.isInitialized = true;
      return true;
    } catch (e) {
      console.error('Init failed:', e);
      this.isInitialized = false;
      return false;
    }
  }

  loadScripts() {
    const ensure = (src) =>
      new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement('script');
        s.src = src; s.async = true; s.defer = true;
        s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
      });

    return Promise.all([
      ensure('https://accounts.google.com/gsi/client'),
      new Promise((resolve, reject) => {
        // gapi needs a special load step
        if (window.gapi?.client) return resolve();
        const s = document.createElement('script');
        s.src = 'https://apis.google.com/js/api.js'; s.async = true; s.defer = true;
        s.onload = () => window.gapi.load('client', resolve);
        s.onerror = reject;
        document.head.appendChild(s);
      }).then(() => { this.gapi = window.gapi; })
    ]);
  }

  async initGapiClient() {
    // Only discovery docs; do NOT pass apiKey/clientId here
    await this.gapi.client.init({
      discoveryDocs: [this.discoveryDoc],
    });
  }

  initTokenClient() {
    if (!window.google?.accounts?.oauth2) {
      throw new Error('Google Identity Services not available');
    }
    this.tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: this.clientId,
      scope: 'https://www.googleapis.com/auth/gmail.readonly',
      callback: () => {}, // set per-request
    });
  }

  async authenticate({ prompt = 'consent' } = {}) {
    // Request/refresh an access token using GIS
    return new Promise((resolve, reject) => {
      if (!this.tokenClient) return reject(new Error('Token client not ready'));
      this.tokenClient.callback = (resp) => {
        if (resp.error) return reject(resp);
        resolve(resp);
      };
      this.tokenClient.requestAccessToken({ prompt });
    });
  }

  isAuthenticated() {
    // With GIS, token lives in gapi.client
    const token = this.gapi?.client?.getToken?.();
    return !!(token && token.access_token);
  }

  async signOut() {
    const token = this.gapi?.client?.getToken?.();
    if (token?.access_token) {
      // Revoke and clear token
      await new Promise((res) =>
        window.google.accounts.oauth2.revoke(token.access_token, res)
      );
      this.gapi.client.setToken(null);
    }
  }

  // Check if service is properly configured
  isConfigured() {
    return !!(this.clientId);
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.gapi?.client?.getToken?.();
    return !!(token && token.access_token);
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
