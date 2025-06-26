# Blurmy: Intelligent Job Application Automation Extension

## 1. Project Overview

Blurmy is a browser extension designed to streamline the job application process. It automatically fills out online forms on various job portals using user-defined profile data. Users create a comprehensive profile within the extension, storing personal, professional, and project-related information. When encountering a job application form, users can right-click and select "Fill with Blurmy" to populate the fields.

This project was bootstrapped with the assistance of an AI software engineer, Jules.

## 2. Core Problem Solved

Job seekers spend significant time manually entering redundant information across numerous online application forms. Blurmy aims to eliminate this repetitive task, saving time and reducing errors.

## 3. Key Features (Implemented & Planned)

*   **User Authentication**: Secure sign-up/login via Firebase Authentication.
*   **Comprehensive User Profile**: Store detailed personal, educational, professional, and project information in Firebase Firestore.
*   **Context Menu Integration**: "Fill with Blurmy" option via right-click.
*   **Intelligent Form Filling (Placeholder)**: Basic content script interaction is set up. Advanced field detection and data mapping are future goals.
*   **API Key Management**: Input for an external API key (e.g., for AI services) stored in the user's profile.

## 4. Technical Stack

*   **Frontend (Popup & Options UI)**: React, TypeScript, Shadcn UI (manual setup due to sandbox limitations), Tailwind CSS.
*   **Backend & Database**: Google Firebase (Authentication, Cloud Firestore).
*   **Extension Framework**: Chrome Extension Manifest V3.
*   **Build Tools**: Vite (for UI), TypeScript CLI (for background/content scripts).

## 5. Project Structure

```
.
├── icons/                     # Placeholder extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── src/                       # Source code
│   ├── background.ts          # Extension service worker
│   ├── content.ts             # Script injected into web pages
│   └── ui/                    # React UI source code (Vite project)
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/    # UI components (Auth, Profile)
│       │   │   ├── Auth/
│       │   │   └── Profile/
│       │   ├── hooks/         # Custom React hooks (e.g., useAuth)
│       │   ├── lib/           # Utility functions (e.g., Shadcn's cn)
│       │   ├── types/         # TypeScript type definitions
│       │   ├── App.tsx        # Main App component for popup/options
│       │   ├── firebase.ts    # Firebase app initialization
│       │   ├── firebaseConfig.ts # Firebase project config (NEEDS USER INPUT)
│       │   ├── index.css      # Global styles & Tailwind directives
│       │   ├── optionsEntry.tsx # Entry point for options page UI
│       │   └── popupEntry.tsx # Entry point for popup UI
│       ├── components.json    # Shadcn UI configuration
│       ├── index.html         # Vite dev server entry point
│       ├── package.json       # UI project dependencies & scripts
│       ├── postcss.config.js
│       ├── tailwind.config.js
│       ├── tsconfig.app.json
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       └── vite.config.ts     # Vite configuration
├── firestore.rules            # Security rules for Firestore (NEEDS USER CONFIGURATION)
├── manifest.json              # Extension manifest file
├── options.html               # Extension options page
├── package.json               # Root project build scripts & dependencies
├── popup.html                 # Extension popup page
├── README.md                  # This file
├── tsconfig.background.json   # TypeScript config for background.ts
└── tsconfig.content.json    # TypeScript config for content.ts

```
**Built files (after `npm run build`):**
*   `background.js` (in root)
*   `content.js` (in root)
*   `ui/` (in root, contains built React app: `popup.js`, `options.js`, assets)


## 6. Setup and Installation

**Prerequisites:**
*   Node.js and npm (or yarn/pnpm) installed.
*   A Google Firebase project.

**Steps:**

1.  **Clone the Repository (or download the files).**

2.  **Install Root Dependencies:**
    Navigate to the project root directory in your terminal and run:
    ```bash
    npm install
    ```
    This installs `typescript` and `@types/chrome` needed for building the background and content scripts.
    *(Note: If you encounter issues with npm in some environments, ensure you have a stable Node.js version.)*

3.  **Install UI Dependencies:**
    Navigate to the UI project directory:
    ```bash
    cd src/ui
    npm install
    ```
    This installs React, Firebase, Tailwind, Shadcn UI core libraries, and other UI-related dependencies.
    *(Note: This step might have issues in restricted sandbox environments where npm commands failed during development. If `node_modules` for `src/ui` seems incomplete, this step is crucial in your local environment.)*
    *   **Shadcn UI Components**: The project uses placeholders for Shadcn UI components (Input, Button, Label) due to difficulties running the Shadcn CLI (`npx shadcn-ui add ...`) in the development sandbox. You may need to manually add these components or ensure they are correctly set up if you have `npm/npx` working locally. The configuration files (`tailwind.config.js`, `components.json`, `lib/utils.ts`) have been created.

4.  **Configure Firebase:**
    *   Open `src/ui/src/firebaseConfig.ts`.
    *   Replace the placeholder values with your actual Firebase project configuration details:
        ```javascript
        const firebaseConfig = {
          apiKey: "YOUR_API_KEY",
          authDomain: "YOUR_AUTH_DOMAIN",
          projectId: "YOUR_PROJECT_ID",
          storageBucket: "YOUR_STORAGE_BUCKET",
          messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
          appId: "YOUR_APP_ID",
          // measurementId: "YOUR_MEASUREMENT_ID" // Optional
        };
        ```
    *   In your Firebase project console:
        *   Enable **Firebase Authentication**: Add the "Email/Password" sign-in provider.
        *   Set up **Cloud Firestore**: Create a Firestore database. Go to the "Rules" tab and paste the content of `firestore.rules` from the project root. Publish the rules.

5.  **Build the Extension:**
    From the project root directory, run:
    ```bash
    npm run build
    ```
    This command will:
    *   Compile `src/background.ts` to `background.js` (in the root).
    *   Compile `src/content.ts` to `content.js` (in the root).
    *   Build the React UI from `src/ui` into a new `ui/` directory in the project root (containing `popup.js`, `options.js`, etc.).

6.  **Load the Extension in Chrome:**
    *   Open Chrome and navigate to `chrome://extensions`.
    *   Enable "Developer mode" (usually a toggle in the top right).
    *   Click "Load unpacked".
    *   Select the **root directory** of this project (the one containing `manifest.json`).
    *   The Blurmy extension icon should appear in your Chrome toolbar.

## 7. How to Use

*   **Sign Up/Login**: Click the Blurmy icon in your Chrome toolbar to open the popup. Create an account or log in.
*   **Manage Profile**: Once logged in, the popup (or the options page, accessible by right-clicking the extension icon and choosing "Options") will allow you to fill in your profile details. Save your profile.
*   **Fill Forms**: Navigate to a web page with a form. Right-click on the page and select "Fill with Blurmy" from the context menu. (Currently, this will trigger a placeholder alert).

## 8. Development Notes & Limitations

*   **NPM/NPX in Sandbox**: During development with Jules (AI), `npm install` and `npx` commands in the `run_in_bash_session` tool were unreliable, often failing with `uv_cwd` errors. This means:
    *   `node_modules` in `src/ui` might not have been fully populated by the AI. Running `npm install` in `src/ui` locally is important.
    *   Shadcn UI components were not added using its CLI; basic HTML elements styled with Tailwind are used as placeholders.
    *   Dependencies like `uuid` were added to `package.json` but might not have been installed in the sandbox.
*   **Icons**: The icons in the `icons/` directory are placeholders. Replace them with actual PGN images for the extension.
*   **Form Filling Logic**: The core form filling logic in `content.ts` is now a basic placeholder that attempts to identify some input fields and logs them. The next steps would involve implementing more intelligent field detection and data mapping using the user's profile.

## 9. Future Enhancements (as per original brief)

*   Intelligent form field detection (ID, name, placeholder, label analysis; AI/ML for complex cases).
*   Advanced data mapping from profile to form fields.
*   Handling dynamic forms.
*   Resume/CV upload handling (placeholder).
*   AI integration using the user-provided API key for contextual answer generation and field parsing.

---
This README should provide a good starting point for users.
```
