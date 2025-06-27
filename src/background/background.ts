import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Create context menu on extension installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "fillWithBlurmy",
    title: "Fill with Blurmy",
    contexts: ["page"],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "fillWithBlurmy" && tab?.id) {
    try {
      // Get current user
      const user = auth.currentUser;
      if (!user) {
        // Show login prompt
        chrome.tabs.sendMessage(tab.id, {
          action: "showLoginPrompt",
        });
        return;
      }

      // Get user profile from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        chrome.tabs.sendMessage(tab.id, {
          action: "showProfilePrompt",
        });
        return;
      }

      const profile = userDoc.data();

      // Send profile data to content script
      chrome.tabs.sendMessage(tab.id, {
        action: "fillForm",
        profile: profile,
      });
    } catch (error) {
      console.error("Error in context menu handler:", error);
      chrome.tabs.sendMessage(tab.id, {
        action: "showError",
        error: "Failed to load profile data",
      });
    }
  }
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === "getUserProfile") {
    const user = auth.currentUser;
    if (user) {
      sendResponse({ user: user });
    } else {
      sendResponse({ user: null });
    }
  }

  if (request.action === "signOut") {
    auth
      .signOut()
      .then(() => {
        sendResponse({ success: true });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep message channel open for async response
  }
});

// Handle authentication state changes
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User signed in:", user.email);
  } else {
    console.log("User signed out");
  }
});

// Open options page in a new tab when extension icon is clicked
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("options/index.html") });
});
