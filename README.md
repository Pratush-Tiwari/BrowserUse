# Blurmy - Intelligent Job Application Automation

Blurmy is a powerful browser extension that automates the process of filling out online job application forms using your stored profile data. It intelligently matches form fields with your information and fills them automatically, saving you time and ensuring consistency across applications.

## Features

### 🔐 Secure Authentication

- Firebase Authentication integration
- Email/password registration and login
- Secure profile data storage

### 📝 Comprehensive Profile Management

- Personal information (name, email, phone, address)
- Professional links (LinkedIn, GitHub, portfolio)
- Skills management with tags
- Work experience with detailed descriptions
- Education history
- Real-time profile updates

### 🤖 Intelligent Form Filling

- Context menu integration ("Fill with Blurmy")
- Smart field matching based on field names and IDs
- Automatic form detection and filling
- Configurable fill delay to avoid detection
- Success/error notifications

### ⚙️ Customizable Settings

- Auto-fill on page load option
- Notification preferences
- Fill delay configuration
- Field matching threshold settings
- Data export and privacy controls

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Chrome/Chromium-based browser

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd browser-use
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase config to `src/lib/firebase.ts`

4. **Build the extension**

   ```bash
   npm run build
   ```

5. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder from the build output

## Usage

### First Time Setup

1. Click the Blurmy extension icon in your browser
2. Register a new account or log in
3. Complete your profile with all relevant information
4. Save your profile

### Using the Extension

1. Navigate to any job application form
2. Right-click on the page
3. Select "Fill with Blurmy" from the context menu
4. The extension will automatically fill matching fields
5. Review and submit the form

### Managing Your Profile

- Click the extension icon to open the popup
- Use the tabs to navigate between Profile, Experience, and Education
- Edit your information and save changes
- Add/remove skills, work experience, and education entries

### Settings

- Access settings by right-clicking the extension icon and selecting "Options"
- Configure auto-fill behavior, notifications, and privacy settings
- Export your data or reset to defaults

## Development

### Project Structure

```
src/
├── background/          # Background script for context menu
├── content/            # Content script for form filling
├── lib/               # Shared utilities and Firebase config
├── options/           # Options page for settings
└── popup/            # Extension popup interface
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build extension for production
- `npm run preview` - Preview built extension

### Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Firebase** - Authentication and database
- **Vite** - Build tool
- **Chrome Extension APIs** - Browser integration

## Configuration

### Firebase Setup

1. Create a new Firebase project
2. Enable Authentication with Email/Password provider
3. Create a Firestore database
4. Update the Firebase configuration in `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
};
```

### Environment Variables

Create a `.env` file in the root directory:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Security

- All user data is stored securely in Firebase Firestore
- Authentication is handled through Firebase Auth
- No sensitive data is stored locally in the browser
- Extension only requests necessary permissions

## Privacy

- Profile data is only used for form filling
- No data is shared with third parties
- Users can export and delete their data at any time
- Extension only runs on user-initiated actions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

## Roadmap

- [ ] Support for more form field types
- [ ] Template-based form filling
- [ ] Integration with job boards
- [ ] Resume parsing and import
- [ ] Application tracking
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Mobile app companion

---

**Note**: This extension is designed to assist with job applications but should be used responsibly. Always review filled information before submitting applications.
