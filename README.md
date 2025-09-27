# 📧 Email Time Parser

A React web application that parses emails for time-related information such as assignment due dates, billing due dates, and meeting schedules. When time-related content is detected, the app summarizes the content and sends notifications to keep users updated.

## ✨ Features

- **Smart Email Parsing**: Detects various time-related patterns including:
  - Due dates and deadlines
  - Payment and billing dates
  - Assignment due dates
  - Meeting schedules
  - Relative time references (tomorrow, next week, etc.)

- **Real-time Notifications**: Browser notifications for time-sensitive emails
- **Gmail Integration**: Connect to Gmail API for real email parsing
- **Mock Data Support**: Demo mode with sample emails
- **Priority Classification**: High, medium, and low priority alerts
- **Firebase Authentication**: Secure Google OAuth login

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Firebase project with Authentication and Messaging enabled
- Gmail API credentials (optional, for real email integration)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd emoji-rage
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Update `src/lib/firebase.js` with your Firebase configuration
   - Enable Authentication and Messaging in Firebase Console
   - Generate a VAPID key for messaging

4. (Optional) Configure Gmail API:
   - Create a Google Cloud Project
   - Enable Gmail API
   - Create OAuth2 credentials
   - Add environment variables for Gmail API keys

5. Start the development server:
```bash
npm start
```

## 📱 Usage

### 1. Authentication
- Click "Continue with Google" to sign in
- Grant necessary permissions

### 2. Email Source Selection
- **Mock Data (Demo)**: Use sample emails for testing
- **Gmail API**: Connect to your Gmail account for real emails

### 3. Notification Setup
- Click "Enable Notifications" to allow browser notifications
- Notifications will appear for time-related emails

### 4. Parse Emails
- Click "Parse Emails" to analyze emails for time-related content
- View results in the dashboard with priority indicators

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication (Google provider)
3. Enable Cloud Messaging
4. Update configuration in `src/lib/firebase.js`

### Gmail API Setup (Optional)
1. **Quick Start**: The app works with Mock Data by default - no setup required!
2. **For Gmail Integration**: Follow the detailed guide in `GMAIL_SETUP.md`
3. **Create .env file** in the project root:
```bash
REACT_APP_GMAIL_API_KEY=your_api_key
REACT_APP_GMAIL_CLIENT_ID=your_client_id
```
4. **Restart the app**: `npm start`

## 📊 Time Detection Patterns

The parser detects various time-related patterns:

### Date Formats
- MM/DD/YYYY, DD-MM-YYYY, YYYY-MM-DD
- Month names (January 15, 2024)
- Abbreviated months (Jan 15, 2024)

### Time Formats
- 12-hour format (2:30 PM)
- 24-hour format (14:30)

### Relative Time
- Tomorrow, today, yesterday
- Next week/month/year
- "In X days/weeks/months"

### Keywords
- Due dates: "due", "deadline", "submit by"
- Payments: "payment due", "bill due"
- Assignments: "assignment due", "homework due"
- Meetings: "meeting scheduled", "appointment"

## 🎯 Priority Levels

- **High**: Urgent keywords (urgent, ASAP, today, tomorrow)
- **Medium**: Payment due dates, assignment deadlines
- **Low**: General time-related content

## 🔔 Notifications

The app sends browser notifications for:
- Time-related emails with high priority
- Due dates and deadlines
- Payment reminders
- Meeting schedules

## 🛠️ Technical Stack

- **Frontend**: React 19
- **Authentication**: Firebase Auth
- **Notifications**: Firebase Cloud Messaging
- **Email Integration**: Gmail API
- **Styling**: Inline CSS (modern, responsive design)

## 📁 Project Structure

```
src/
├── lib/
│   ├── firebase.js          # Firebase configuration
│   ├── emailParser.js       # Email parsing logic
│   ├── notificationService.js # Notification handling
│   └── gmailService.js      # Gmail API integration
├── screens/
│   ├── Login.js            # Authentication screen
│   └── Dashboard.js        # Main application dashboard
└── App.js                  # Main app component
```

## 🚨 Troubleshooting

### Common Issues

1. **Notifications not working**:
   - Check browser notification permissions
   - Ensure Firebase Messaging is properly configured
   - Verify VAPID key is set

2. **Gmail API errors**:
   - Verify API credentials
   - Check OAuth2 configuration
   - Ensure Gmail API is enabled

3. **Firebase authentication issues**:
   - Verify Firebase configuration
   - Check Google OAuth provider setup
   - Ensure domain is authorized

## 🔒 Security

- All email data is processed locally
- No email content is stored on external servers
- Firebase handles secure authentication
- Gmail API uses OAuth2 for secure access

## 📈 Future Enhancements

- Email filtering and search
- Calendar integration
- Email scheduling
- Advanced time parsing
- Mobile app support
- Team collaboration features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review Firebase and Gmail API documentation