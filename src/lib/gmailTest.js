// Simple Gmail API test utility
import { gmailService } from './gmailService';

export const testGmailConnection = async () => {
  console.log('Testing Gmail connection...');
  
  try {
    // Check configuration
    if (!gmailService.isConfigured()) {
      console.log('❌ Gmail API not configured');
      return { success: false, error: 'Gmail API not configured' };
    }
    
    console.log('✅ Gmail API configured');
    
    // Test initialization
    const initialized = await gmailService.init();
    if (initialized) {
      console.log('✅ Gmail API initialized successfully');
      return { success: true };
    } else {
      console.log('❌ Failed to initialize Gmail API');
      return { success: false, error: 'Failed to initialize' };
    }
  } catch (error) {
    console.log('❌ Gmail connection test failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Test script loading
export const testScriptLoading = () => {
  console.log('Testing script loading...');
  
  // Check if gapi is available
  if (typeof window !== 'undefined' && window.gapi) {
    console.log('✅ Gmail API script already loaded');
    return true;
  }
  
  // Check if script is in DOM
  const script = document.querySelector('script[src*="apis.google.com"]');
  if (script) {
    console.log('✅ Gmail API script found in DOM');
    return true;
  }
  
  console.log('❌ Gmail API script not found');
  return false;
};
