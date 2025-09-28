# 🔧 Firebase OAuth Redirect URI Fix

## 🚨 **Error: redirect_uri_mismatch**

This error occurs when the OAuth2 redirect URI in your Google Cloud Console doesn't match what your app is using.

## 🛠️ **Solution Steps:**

### 1. **Go to Google Cloud Console**
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `hackgt-77260`
3. Go to **APIs & Services** → **Credentials**

### 2. **Find Your OAuth2 Client**
1. Look for **OAuth 2.0 Client IDs**
2. Find the client ID: `1085273635297-70kadrtj8q2ti4nqoprih69s57pombes.apps.googleusercontent.com`
3. Click on it to edit

### 3. **Add Authorized JavaScript Origins**
Add these URLs to **Authorized JavaScript origins**:
```
http://localhost:3000
http://localhost:3001
http://127.0.0.1:3000
http://127.0.0.1:3001
```

### 4. **Add Authorized Redirect URIs**
Add these URLs to **Authorized redirect URIs**:
```
http://localhost:3000
http://localhost:3001
http://127.0.0.1:3000
http://127.0.0.1:3001
```

### 5. **Save Changes**
1. Click **Save**
2. Wait 5-10 minutes for changes to propagate
3. Clear your browser cache
4. Try logging in again

## 🔄 **Alternative: Create New OAuth2 Client**

If the above doesn't work, create a new OAuth2 client:

### 1. **Create New Credentials**
1. In Google Cloud Console → **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth 2.0 Client ID**
3. Choose **Web application**

### 2. **Configure the New Client**
- **Name**: `HackGT Email Parser Local`
- **Authorized JavaScript origins**:
  ```
  http://localhost:3000
  http://localhost:3001
  http://127.0.0.1:3000
  http://127.0.0.1:3001
  ```
- **Authorized redirect URIs**:
  ```
  http://localhost:3000
  http://localhost:3001
  http://127.0.0.1:3000
  http://127.0.0.1:3001
  ```

### 3. **Update Your .env File**
Replace the client ID in your `.env` file:
```bash
REACT_APP_GMAIL_CLIENT_ID=your_new_client_id_here
```

## 🚀 **Quick Fix for Development**

### Option 1: Use Firebase Auth Only
If you only need Firebase authentication (not Gmail API), you can disable Gmail integration:

1. **Select "Mock Data"** in the Email Source section
2. **Select "Local Algorithm"** in the AI Parser section
3. **Use Firebase Auth** for login only

### Option 2: Use Different Port
Try running the app on a different port:

```bash
PORT=3001 npm start
```

Then add `http://localhost:3001` to your OAuth2 client.

## 🔍 **Troubleshooting**

### Check Current Configuration
1. **Verify your .env file**:
   ```bash
   cat .env
   ```

2. **Check if the app is running on the right port**:
   - Look for "Local: http://localhost:3000" in terminal
   - Make sure the URL matches your OAuth2 configuration

### Common Issues
1. **Port mismatch**: App running on 3001 but OAuth configured for 3000
2. **Cache issues**: Clear browser cache and cookies
3. **Propagation delay**: OAuth changes can take 5-10 minutes
4. **Wrong project**: Make sure you're editing the right Google Cloud project

### Debug Steps
1. **Check browser console** for specific error messages
2. **Verify the redirect URI** in the error message
3. **Compare with OAuth2 client configuration**
4. **Try incognito mode** to rule out cache issues

## 📱 **Testing the Fix**

1. **Clear browser data**:
   - Clear cookies and cache
   - Or use incognito/private mode

2. **Restart the development server**:
   ```bash
   pkill -f "react-scripts start"
   npm start
   ```

3. **Try logging in again**:
   - Go to `http://localhost:3000`
   - Click "Continue with Google"
   - Should work without redirect_uri_mismatch error

## 🎯 **Expected Result**

After fixing the OAuth2 configuration:
- ✅ Google login popup appears
- ✅ No redirect_uri_mismatch error
- ✅ Successful authentication
- ✅ Access to dashboard

## 📞 **Still Having Issues?**

If the problem persists:
1. **Double-check the OAuth2 client configuration**
2. **Verify the project ID matches** (`hackgt-77260`)
3. **Try creating a completely new OAuth2 client**
4. **Check if Firebase project settings are correct**

The key is ensuring that the redirect URI in your OAuth2 client exactly matches the URL your app is running on!
