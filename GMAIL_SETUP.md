# Gmail API Setup Guide

To use Gmail integration with this app, you need to set up Gmail API credentials.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Gmail API:
   - Go to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click on it and press "Enable"

## Step 2: Create OAuth2 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Add your domain to "Authorized JavaScript origins":
   - For development: `http://localhost:3000`
   - For production: your production domain
5. Copy the Client ID

## Step 3: Create API Key

1. In "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API Key

## Step 4: Configure Environment Variables

Create a `.env` file in the project root:

```bash
REACT_APP_GMAIL_API_KEY=your_api_key_here
REACT_APP_GMAIL_CLIENT_ID=your_client_id_here
```

## Step 5: Restart the Application

After adding the environment variables, restart the development server:

```bash
npm start
```

## Troubleshooting

- **"Gmail API not configured"**: Make sure you've created the `.env` file with the correct credentials
- **"Failed to load Gmail API script"**: Check your internet connection and try again
- **Authentication errors**: Make sure your OAuth2 credentials are correct and the domain is authorized

## Alternative: Use Mock Data

If you don't want to set up Gmail API, you can use the Mock Data option which provides sample emails for testing the time parsing functionality.
