# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### 1. **"Failed to connect to Gmail" Error**

**Symptoms:**
- Error message: "Failed to connect to Gmail. Please check your internet connection and try again."
- Script error in browser console
- Gmail API script fails to load

**Solutions:**

#### A. Check Your .env File
Make sure you have a `.env` file in the project root with your credentials:
```bash
REACT_APP_GMAIL_API_KEY=your_actual_api_key
REACT_APP_GMAIL_CLIENT_ID=your_actual_client_id
```

#### B. Verify Credentials
1. **API Key**: Go to Google Cloud Console → APIs & Services → Credentials → API Keys
2. **Client ID**: Go to Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client IDs

#### C. Check OAuth2 Configuration
- Make sure `http://localhost:3000` is in "Authorized JavaScript origins"
- Make sure Gmail API is enabled in your Google Cloud Project

#### D. Test Connection
1. Click "🧪 Test Connection" button in the app
2. Check browser console for detailed error messages
3. Try "🔄 Refresh Config" to recheck configuration

### 2. **Port Conflicts**

**Symptoms:**
- "Something is already running on port 3000"
- App runs on port 3001 instead

**Solutions:**
```bash
# Kill processes on ports 3000 and 3001
lsof -ti:3000,3001 | xargs kill -9

# Start app on clean port
PORT=3000 npm start
```

### 3. **Script Loading Errors**

**Symptoms:**
- "Script error" in browser console
- Gmail API script fails to load
- Cross-origin errors

**Solutions:**

#### A. Check Internet Connection
- Ensure you have a stable internet connection
- Try accessing `https://apis.google.com/js/api.js` directly in browser

#### B. Browser Security
- Disable ad blockers temporarily
- Check if browser is blocking third-party scripts
- Try in incognito/private mode

#### C. Clear Browser Cache
- Clear browser cache and cookies
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### 4. **Authentication Errors**

**Symptoms:**
- OAuth popup doesn't appear
- "Access denied" errors
- Authentication popup closes immediately

**Solutions:**

#### A. Check OAuth2 Settings
- Verify Client ID is correct
- Ensure `http://localhost:3000` is in authorized origins
- Check that Gmail API is enabled

#### B. Browser Settings
- Allow popups for localhost:3000
- Check if browser is blocking OAuth popups

### 5. **Environment Variables Not Loading**

**Symptoms:**
- "Gmail API not configured" even with .env file
- Credentials not being read

**Solutions:**

#### A. File Location
- Ensure `.env` file is in project root (same level as `package.json`)
- Not in `src/` folder

#### B. File Format
- No spaces around `=`
- No quotes around values
- Use `REACT_APP_` prefix

#### C. Restart Server
- Stop the development server
- Run `npm start` again

### 6. **Mock Data Fallback**

If Gmail continues to fail:

1. **Switch to Mock Data:**
   - Select "Mock Data (Demo)" radio button
   - Click "Parse Emails" to see demo functionality

2. **Mock Data Features:**
   - 5 sample emails with time-related content
   - Full parsing and notification functionality
   - Perfect for testing and demonstration

### 7. **Debug Steps**

#### A. Check Console Logs
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed requests

#### B. Test Script Loading
1. Open browser console
2. Type: `window.gapi`
3. Should return an object, not undefined

#### C. Test API Access
1. Go to: `https://console.cloud.google.com/`
2. Check if Gmail API is enabled
3. Verify credentials are active

### 8. **Quick Fixes**

#### A. Restart Everything
```bash
# Kill all processes
pkill -f "react-scripts start"
lsof -ti:3000,3001 | xargs kill -9

# Clean start
npm start
```

#### B. Clear Everything
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

#### C. Use Mock Data
- Select "Mock Data (Demo)" option
- No configuration required
- Full functionality demonstration

### 9. **Still Having Issues?**

1. **Check the logs:** Open browser console and look for specific error messages
2. **Test connection:** Use the "🧪 Test Connection" button
3. **Use Mock Data:** Switch to Mock Data for immediate functionality
4. **Check setup guide:** Review `GMAIL_SETUP.md` for detailed instructions

### 10. **Success Indicators**

✅ **Working Gmail Setup:**
- "Gmail Status: ✅ Connected"
- No error messages in console
- Can parse real emails

✅ **Working Mock Data:**
- "Mock Data is ready!" message
- Can parse sample emails
- Notifications work

Remember: **Mock Data works immediately** and provides full functionality for testing and demonstration!
