# Development Guide for Blurmy Extension

This guide explains how to set up and test the Blurmy browser extension during development.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Copy your Firebase config to `src/lib/firebase.ts` or create a `.env` file

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 🛠️ Development Scripts

### Development Mode

```bash
# Start popup development server (opens in browser)
npm run dev:popup

# Start options page development server
npm run dev:options

# Start general development server
npm run dev
```

### Building for Extension

```bash
# Build for production
npm run build

# Build for development (with source maps)
npm run build:dev

# Watch mode (rebuilds on file changes)
npm run watch
```

### Other Commands

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Clean build directory
npm run clean
```

## 🧪 Testing the Extension

### Method 1: Development Server (Recommended for UI Testing)

1. Run `npm run dev:popup` to start the popup development server
2. Open `http://localhost:5173` in your browser
3. Test the popup interface, authentication, and profile management
4. Run `npm run dev:options` to test the options page at `http://localhost:5174`

### Method 2: Load Extension in Chrome

1. Build the extension: `npm run build`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the `dist` folder
5. The extension will appear in your extensions list
6. Click the extension icon to test the popup
7. Right-click the extension icon and select "Options" to test settings

### Method 3: Hot Reload Development

1. Run `npm run watch` to start watch mode
2. Load the extension in Chrome (Method 2)
3. Make changes to your code
4. The extension will automatically rebuild
5. Refresh the extension in `chrome://extensions/` to see changes

## 🔧 Development Features

### Development Mode Indicators

- The popup shows a "🚧 Development Mode" banner when running in dev
- A "DEV" badge appears next to the user email
- The options page shows a development mode notice

### Debugging

- Open Chrome DevTools for the popup by right-clicking the extension icon
- Check the Console tab for logs and errors
- Use `console.log()` statements for debugging
- Background script logs appear in the extension's background page

### Testing Form Filling

1. Load the extension in Chrome
2. Navigate to any website with forms
3. Right-click and select "Fill with Blurmy Ai"
4. Check the browser console for content script logs
5. Look for notifications that appear on the page

## 📁 Project Structure

```
src/
├── background/          # Background script (context menu, messaging)
├── content/            # Content script (form filling logic)
├── lib/               # Shared utilities and Firebase config
├── options/           # Options page (settings interface)
└── popup/            # Extension popup (main interface)
    └── components/ui/ # Shadcn UI components
```

## 🔄 Development Workflow

1. **UI Development**: Use `npm run dev:popup` for rapid UI iteration
2. **Extension Testing**: Use `npm run watch` + Chrome extension loading
3. **Background Script**: Test context menu and messaging in loaded extension
4. **Content Script**: Test form filling on actual websites

## 🐛 Common Issues

### Firebase Connection Issues

- Ensure your Firebase project is properly configured
- Check that Authentication and Firestore are enabled
- Verify your environment variables are correct

### Extension Not Loading

- Check the console in `chrome://extensions/` for errors
- Ensure all files are built correctly in the `dist` folder
- Verify the manifest.json is valid

### Hot Reload Not Working

- Make sure you're running `npm run watch`
- Refresh the extension in `chrome://extensions/`
- Check that file paths in vite.config.ts are correct

### TypeScript Errors

- Run `npm run type-check` to see all TypeScript issues
- Ensure all dependencies are installed
- Check that type definitions are properly imported

## 🎯 Testing Checklist

- [ ] Popup authentication (login/register)
- [ ] Profile management (add/edit information)
- [ ] Skills management (add/remove skills)
- [ ] Work experience (add/edit/remove entries)
- [ ] Education history (add/edit/remove entries)
- [ ] Settings page functionality
- [ ] Context menu integration
- [ ] Form filling on test websites
- [ ] Notifications and error handling
- [ ] Data persistence in Firebase

## 🚀 Production Build

When ready for production:

1. Update Firebase security rules
2. Test thoroughly on multiple websites
3. Run `npm run build` for production build
4. Package the `dist` folder for distribution
5. Submit to Chrome Web Store (if applicable)

## 📚 Additional Resources

- [Chrome Extension Development Guide](https://developer.chrome.com/docs/extensions/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
