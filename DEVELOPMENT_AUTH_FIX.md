# 🚨 OAuth Redirect URI Mismatch - Complete Solution

## 🔍 **What's Causing the Problem:**

The error occurs because your Firebase project `hackgt-77260` is configured for a different domain, not for localhost development.

### **Technical Details:**
- **Firebase Project**: `hackgt-77260`
- **Expected Redirect URI**: `https://hackgt-77260.firebaseapp.com/__/auth/handler`
- **Your App URL**: `http://localhost:3000`
- **Mismatch**: Google OAuth doesn't recognize localhost as authorized

## 🛠️ **Solution Options:**

### **Option 1: Fix Google Cloud Console (Recommended)**

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Select Project**: `hackgt-77260`
3. **Navigate to**: APIs & Services → Credentials
4. **Find OAuth 2.0 Client ID**: Look for the one with your project
5. **Edit the OAuth client** and add these to **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:3001
   http://127.0.0.1:3000
   http://127.0.0.1:3001
   https://hackgt-77260.firebaseapp.com
   ```
6. **Add to Authorized redirect URIs**:
   ```
   http://localhost:3000
   http://localhost:3001
   http://127.0.0.1:3000
   http://127.0.0.1:3001
   https://hackgt-77260.firebaseapp.com/__/auth/handler
   ```
7. **Save and wait 5-10 minutes**

### **Option 2: Create New Firebase Project (Easiest)**

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Create New Project**: "Email Parser Dev"
3. **Enable Authentication**: Google sign-in
4. **Add Web App**: Get new config
5. **Update firebase.js** with new config

### **Option 3: Use Development Bypass (Quick Test)**

The app now includes a development bypass for testing without authentication.

## 🚀 **Immediate Workaround:**

I've added a development bypass to your app. Here's how to use it:

1. **Open the app** at `http://localhost:3000`
2. **Look for the development section** at the bottom of the login screen
3. **Click "🚧 Skip Authentication (Dev Only)"**
4. **Test the email parsing functionality** with Mock Data

## 📋 **Step-by-Step Fix:**

### **Method 1: Update Existing OAuth Client**

1. **Open [Google Cloud Console](https://console.cloud.google.com/)**
2. **Select project**: `hackgt-77260`
3. **Go to**: APIs & Services → Credentials
4. **Find**: OAuth 2.0 Client IDs
5. **Click on your OAuth client** (usually named "Web client" or similar)
6. **In "Authorized JavaScript origins"**, add:
   ```
   http://localhost:3000
   http://localhost:3001
   http://127.0.0.1:3000
   http://127.0.0.1:3001
   ```
7. **In "Authorized redirect URIs"**, add:
   ```
   http://localhost:3000
   http://localhost:3001
   http://127.0.0.1:3000
   http://127.0.0.1:3001
   ```
8. **Click Save**
9. **Wait 5-10 minutes** for changes to propagate
10. **Clear browser cache** and try again

### **Method 2: Create New OAuth Client**

1. **In Google Cloud Console** → APIs & Services → Credentials
2. **Click "+ CREATE CREDENTIALS"** → OAuth 2.0 Client ID
3. **Application type**: Web application
4. **Name**: "Email Parser Local Development"
5. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:3001
   http://127.0.0.1:3000
   http://127.0.0.1:3001
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:3000
   http://localhost:3001
   http://127.0.0.1:3000
   http://127.0.0.1:3001
   ```
7. **Click Create**
8. **Copy the Client ID**
9. **Update your .env file**:
   ```bash
   REACT_APP_GMAIL_CLIENT_ID=your_new_client_id_here
   ```

## 🔧 **Alternative: Use Different Port**

If the above doesn't work, try running on a different port:

```bash
PORT=3001 npm start
```

Then add `http://localhost:3001` to your OAuth client.

## 🎯 **Quick Test Without OAuth:**

1. **Use the development bypass** in the login screen
2. **Select "Mock Data"** for email source
3. **Select "Local Algorithm"** for parsing
4. **Test the email parsing functionality**

## 📱 **Expected Result After Fix:**

- ✅ Google login popup appears
- ✅ No redirect_uri_mismatch error
- ✅ Successful authentication
- ✅ Access to dashboard with full functionality

## 🚨 **If Still Not Working:**

1. **Check the exact error message** in browser console
2. **Verify the OAuth client configuration** matches your app URL
3. **Try incognito/private mode** to rule out cache issues
4. **Use the development bypass** to test functionality

The key is ensuring that the redirect URI in your OAuth2 client exactly matches the URL your app is running on!
