import React, { useState, useEffect } from 'react';
import { EmailParser, mockEmails } from '../lib/emailParser';
import { notificationService, sendNotificationsForParsedEmails } from '../lib/notificationService';
import { gmailService, fetchAndParseEmails } from '../lib/gmailService';
import { testGmailConnection, testScriptLoading } from '../lib/gmailTest';
import { geminiService, parseEmailsWithGemini } from '../lib/geminiService';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Dashboard() {
  const [emails, setEmails] = useState([]);
  const [parsedEmails, setParsedEmails] = useState([]);
  const [timeRelatedEmails, setTimeRelatedEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [user, setUser] = useState(null);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [useGmail, setUseGmail] = useState(false);
  const [gmailConfigured, setGmailConfigured] = useState(false);
  const [useGemini, setUseGemini] = useState(true);
  const [geminiConfigured, setGeminiConfigured] = useState(false);
  const [insights, setInsights] = useState(null);

  const emailParser = new EmailParser();

  useEffect(() => {
    // Get current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Check notification permission
    setNotificationsEnabled(notificationService.isNotificationSupported());

    // Check Gmail configuration
    try {
      setGmailConfigured(gmailService?.isConfigured?.() || false);
    } catch (error) {
      console.error('Error checking Gmail configuration:', error);
      setGmailConfigured(false);
    }
    
    // Check Gemini configuration
    try {
      setGeminiConfigured(geminiService?.isGeminiConfigured?.() || false);
    } catch (error) {
      console.error('Error checking Gemini configuration:', error);
      setGeminiConfigured(false);
    }

    return () => unsubscribe();
  }, []);

  // Load and parse emails
  const loadEmails = async () => {
    setLoading(true);
    try {
      let fetchedEmails;
      let result;
      
      if (useGmail && gmailConnected) {
        // Use Gmail API
        const gmailResult = await fetchAndParseEmails(emailParser, 10);
        fetchedEmails = gmailResult.emails;
        
        if (useGemini && geminiConfigured) {
          // Use Gemini AI for parsing
          result = await parseEmailsWithGemini(fetchedEmails);
          setParsedEmails(result.parsedEmails);
          setTimeRelatedEmails(result.timeRelatedEmails);
          setInsights(result.insights);
        } else {
          // Use local parser
          setParsedEmails(gmailResult.parsedEmails);
          setTimeRelatedEmails(gmailResult.timeRelatedEmails);
        }
      } else {
        // Use mock data
        fetchedEmails = mockEmails;
        
        if (useGemini && geminiConfigured) {
          // Use Gemini AI for parsing
          result = await parseEmailsWithGemini(fetchedEmails);
          setParsedEmails(result.parsedEmails);
          setTimeRelatedEmails(result.timeRelatedEmails);
          setInsights(result.insights);
        } else {
          // Use local parser
          const parsed = emailParser.parseEmails(fetchedEmails);
          setParsedEmails(parsed);
          
          const timeRelated = parsed.filter(email => email.hasTimeInfo);
          setTimeRelatedEmails(timeRelated);
        }
      }
      
      setEmails(fetchedEmails);

      // Send notifications if enabled
      if (notificationsEnabled && timeRelatedEmails.length > 0) {
        sendNotificationsForParsedEmails(parsedEmails);
      }
    } catch (error) {
      console.error('Error loading emails:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle notification permission request
  const requestNotificationPermission = async () => {
    const granted = await notificationService.requestPermission();
    setNotificationsEnabled(granted);
    if (granted) {
      await notificationService.getToken();
    }
  };

  // Refresh Gmail configuration check
  const refreshGmailConfig = () => {
    try {
      setGmailConfigured(gmailService?.isConfigured?.() || false);
    } catch (error) {
      console.error('Error refreshing Gmail configuration:', error);
      setGmailConfigured(false);
    }
  };

  // Test Gmail connection
  const testGmail = async () => {
    console.log('=== Gmail Connection Test ===');
    
    // Test script loading
    const scriptLoaded = testScriptLoading();
    console.log('Script loaded:', scriptLoaded);
    
    // Test Gmail connection
    const result = await testGmailConnection();
    console.log('Connection test result:', result);
    
    if (result.success) {
      alert('✅ Gmail connection test passed! You can now try connecting.');
    } else {
      alert(`❌ Gmail connection test failed: ${result.error}`);
    }
  };

  // Handle Gmail connection
  const connectGmail = async () => {
    try {
      setLoading(true);
      
      // Check if Gmail is properly configured
      if (!gmailService.isConfigured()) {
        alert('Gmail API is not configured. Please set up Gmail API credentials or use Mock Data instead.');
        return;
      }
      
      console.log('Initializing Gmail API...');
      const initialized = await gmailService.init();
      
      if (initialized) {
        console.log('Gmail API initialized, authenticating...');
        await gmailService.authenticate();
        setGmailConnected(true);
        setUseGmail(true);
        console.log('Gmail connected successfully');
      } else {
        console.error('Failed to initialize Gmail API');
        alert('Failed to initialize Gmail API. Please check your internet connection and try again.');
      }
    } catch (error) {
      console.error('Error connecting to Gmail:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Gmail connection failed. ';
      if (error.message.includes('timeout')) {
        errorMessage += 'The request timed out. Please check your internet connection.';
      } else if (error.message.includes('script')) {
        errorMessage += 'Failed to load Gmail API script. Please check your internet connection.';
      } else if (error.message.includes('aborted')) {
        errorMessage += 'The connection was aborted. Please try again.';
      } else {
        errorMessage += error.message;
      }
      
      alert(`${errorMessage} Please try again or use Mock Data instead.`);
      
      // Automatically suggest switching to Mock Data
      if (window.confirm('Would you like to switch to Mock Data for now?')) {
        setUseGmail(false);
        setGmailConnected(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      if (gmailConnected) {
        await gmailService.signOut();
      }
      
      // Check if using development bypass
      const devUser = localStorage.getItem('dev-auth-user');
      if (devUser) {
        localStorage.removeItem('dev-auth-user');
        window.location.reload();
        return;
      }
      
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#44aa44';
      default: return '#666666';
    }
  };

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'Deadline': return '📅';
      case 'Payment': return '💳';
      case 'Assignment': return '📝';
      case 'Meeting': return '🤝';
      default: return '⏰';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <div>
          <h1>📧 Email Time Parser</h1>
          <p>Welcome, {user?.displayName || user?.email || 'User'}!</p>
        </div>
        <div>
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* AI Parser Settings */}
      <div style={{ 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#e8f5e8',
        borderRadius: '8px',
        border: '1px solid #c3e6c3'
      }}>
        <h3>🤖 AI Email Parser</h3>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="radio" 
              name="parserType" 
              checked={useGemini}
              onChange={() => setUseGemini(true)}
            />
            Google Gemini AI (Recommended)
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="radio" 
              name="parserType" 
              checked={!useGemini}
              onChange={() => setUseGemini(false)}
            />
            Local Algorithm
          </label>
        </div>
        
        {useGemini && (
          <div>
            <p>Gemini Status: {geminiConfigured ? '✅ Configured' : '❌ Not Configured'}</p>
            {!geminiConfigured ? (
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffeaa7',
                borderRadius: '4px',
                marginTop: '10px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>🧠 Gemini AI Setup Required</h4>
                <p style={{ margin: '0 0 10px 0', color: '#856404' }}>
                  To use Google Gemini AI for intelligent email parsing, you need to set up your API key.
                </p>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  <p style={{ margin: '5px 0' }}>1. Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></p>
                  <p style={{ margin: '5px 0' }}>2. Create a new API key</p>
                  <p style={{ margin: '5px 0' }}>3. Add REACT_APP_GEMINI_API_KEY to your .env file</p>
                  <p style={{ margin: '5px 0' }}>4. Restart the development server</p>
                </div>
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button 
                    onClick={() => {
                      const envContent = `# Gemini AI Configuration
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here`;
                      const blob = new Blob([envContent], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = '.env';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#2196f3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    📥 Download .env Template
                  </button>
                  <button 
                    onClick={() => {
                      try {
                        setGeminiConfigured(geminiService?.isGeminiConfigured?.() || false);
                      } catch (error) {
                        console.error('Error refreshing Gemini configuration:', error);
                        setGeminiConfigured(false);
                      }
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🔄 Refresh Config
                  </button>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    or use <strong>Local Algorithm</strong>
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ 
                padding: '10px', 
                backgroundColor: '#d4edda', 
                border: '1px solid #c3e6cb',
                borderRadius: '4px',
                marginTop: '10px'
              }}>
                <p style={{ margin: '0', color: '#155724', fontSize: '14px' }}>
                  ✅ <strong>Gemini AI is ready!</strong> Your emails will be analyzed with advanced AI for better time detection and insights.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Email Source Settings */}
      <div style={{ 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h3>📧 Email Source</h3>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="radio" 
              name="emailSource" 
              checked={!useGmail}
              onChange={() => setUseGmail(false)}
            />
            Mock Data (Demo) - Ready to use!
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="radio" 
              name="emailSource" 
              checked={useGmail}
              onChange={() => setUseGmail(true)}
            />
            Gmail API {!gmailConfigured && '(Setup Required)'}
          </label>
        </div>
        
        {!useGmail && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#d4edda', 
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            marginBottom: '10px'
          }}>
            <p style={{ margin: '0', color: '#155724', fontSize: '14px' }}>
              ✅ <strong>Mock Data is ready!</strong> Click "Parse Emails" to see the demo with sample emails.
            </p>
          </div>
        )}
        
        {useGmail && (
          <div>
            <p>Gmail Status: {gmailConnected ? '✅ Connected' : '❌ Not Connected'}</p>
            {!gmailConnected && (
              <div>
                {!gmailConfigured ? (
                  <div style={{ 
                    padding: '15px', 
                    backgroundColor: '#e3f2fd', 
                    border: '1px solid #2196f3',
                    borderRadius: '4px',
                    marginTop: '10px'
                  }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>📧 Gmail API Setup Required</h4>
                    <p style={{ margin: '0 0 10px 0', color: '#1976d2' }}>
                      To use Gmail integration, you need to set up Gmail API credentials.
                    </p>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      <p style={{ margin: '5px 0' }}>1. Create a Google Cloud Project</p>
                      <p style={{ margin: '5px 0' }}>2. Enable Gmail API</p>
                      <p style={{ margin: '5px 0' }}>3. Create OAuth2 credentials</p>
                      <p style={{ margin: '5px 0' }}>4. Add credentials to .env file</p>
                    </div>
                    <div style={{ marginTop: '10px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => {
                          const envContent = `# Gmail API Configuration
REACT_APP_GMAIL_API_KEY=your_gmail_api_key_here
REACT_APP_GMAIL_CLIENT_ID=your_gmail_client_id_here`;
                          const blob = new Blob([envContent], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = '.env';
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#2196f3',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        📥 Download .env Template
                      </button>
                      <button 
                        onClick={refreshGmailConfig}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#4caf50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🔄 Refresh Config
                      </button>
                      <button 
                        onClick={testGmail}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#ff9800',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        🧪 Test Connection
                      </button>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        or use <strong>Mock Data</strong> for demo
                      </span>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={connectGmail}
                    disabled={loading}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      marginTop: '10px'
                    }}
                  >
                    {loading ? 'Connecting...' : 'Connect Gmail'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div style={{ 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#e8f4fd',
        borderRadius: '8px',
        border: '1px solid #bee5eb'
      }}>
        <h3>🔔 Notification Settings</h3>
        <p>Status: {notificationsEnabled ? '✅ Enabled' : '❌ Disabled'}</p>
        {!notificationsEnabled && (
          <button 
            onClick={requestNotificationPermission}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Enable Notifications
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ marginBottom: '30px' }}>
        <button 
          onClick={loadEmails}
          disabled={loading}
          style={{
            padding: '15px 30px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            marginRight: '10px'
          }}
        >
          {loading ? 'Loading...' : '📥 Parse Emails'}
        </button>
      </div>

      {/* AI Insights */}
      {insights && useGemini && (
        <div style={{ 
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#e8f5e8',
          borderRadius: '8px',
          border: '1px solid #c3e6c3'
        }}>
          <h2>🧠 AI Insights</h2>
          <div style={{ marginBottom: '15px' }}>
            <h4>📊 Analysis</h4>
            <p style={{ margin: '0', color: '#333', fontSize: '16px' }}>{insights.insights}</p>
          </div>
          
          {insights.recommendations && insights.recommendations.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <h4>💡 Recommendations</h4>
              <ul style={{ margin: '0', paddingLeft: '20px' }}>
                {insights.recommendations.map((rec, index) => (
                  <li key={index} style={{ marginBottom: '5px', color: '#333' }}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
          
          {insights.upcomingDeadlines && insights.upcomingDeadlines.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <h4>⏰ Upcoming Deadlines</h4>
              <ul style={{ margin: '0', paddingLeft: '20px' }}>
                {insights.upcomingDeadlines.map((deadline, index) => (
                  <li key={index} style={{ marginBottom: '5px', color: '#d63384', fontWeight: 'bold' }}>{deadline}</li>
                ))}
              </ul>
            </div>
          )}
          
          {insights.priorityActions && insights.priorityActions.length > 0 && (
            <div>
              <h4>🚨 Priority Actions</h4>
              <ul style={{ margin: '0', paddingLeft: '20px' }}>
                {insights.priorityActions.map((action, index) => (
                  <li key={index} style={{ marginBottom: '5px', color: '#dc3545', fontWeight: 'bold' }}>{action}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Statistics */}
      {parsedEmails.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3>{emails.length}</h3>
            <p>Total Emails</p>
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#fff3cd', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3>{timeRelatedEmails.length}</h3>
            <p>Time-Related</p>
          </div>
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#d1ecf1', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h3>{timeRelatedEmails.filter(email => email.summary?.priority === 'high').length}</h3>
            <p>High Priority</p>
          </div>
        </div>
      )}

      {/* Time-Related Emails */}
      {timeRelatedEmails.length > 0 && (
        <div style={{ marginBottom: '30px' }}>
          <h2>⏰ Time-Related Emails</h2>
          <div style={{ display: 'grid', gap: '20px' }}>
            {timeRelatedEmails.map((email, index) => (
              <div 
                key={index}
                style={{
                  padding: '20px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>
                      {getTypeIcon(email.summary.type)} {email.summary.type}
                    </h4>
                    <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                      From: {email.summary.from}
                    </p>
                  </div>
                  <span 
                    style={{
                      padding: '4px 8px',
                      backgroundColor: getPriorityColor(email.summary.priority),
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {email.summary.priority.toUpperCase()}
                  </span>
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                  <strong>Subject:</strong> {email.summary.subject}
                </div>
                
                <div style={{ marginBottom: '10px' }}>
                  <strong>Time-Related Content:</strong>
                  <div style={{ 
                    backgroundColor: '#f8f9fa', 
                    padding: '10px', 
                    borderRadius: '4px',
                    marginTop: '5px',
                    fontFamily: 'monospace',
                    fontSize: '14px'
                  }}>
                    {email.summary.content}
                  </div>
                </div>
                
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Detected: {new Date(email.summary.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Emails */}
      {parsedEmails.length > 0 && (
        <div>
          <h2>📧 All Emails</h2>
          <div style={{ display: 'grid', gap: '15px' }}>
            {parsedEmails.map((email, index) => (
              <div 
                key={index}
                style={{
                  padding: '15px',
                  backgroundColor: email.hasTimeInfo ? '#fff3cd' : 'white',
                  borderRadius: '8px',
                  border: `1px solid ${email.hasTimeInfo ? '#ffc107' : '#ddd'}`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0' }}>
                      {email.hasTimeInfo && '⏰ '}{email.originalEmail.subject}
                    </h4>
                    <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                      From: {email.originalEmail.from}
                    </p>
                  </div>
                  {email.hasTimeInfo && (
                    <span style={{ 
                      padding: '2px 6px', 
                      backgroundColor: '#ffc107', 
                      color: '#856404',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      TIME-RELATED
                    </span>
                  )}
                </div>
                
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
                  {email.originalEmail.body.substring(0, 150)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {parsedEmails.length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h3>No emails parsed yet</h3>
          <p>Click "Parse Emails" to analyze your emails for time-related information.</p>
        </div>
      )}
    </div>
  );
}
