// src/background.ts
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "fillWithBlurmy",
    title: "Fill with Blurmy",
    contexts: ["page", "editable"]
  });
  console.log("Blurmy context menu created.");
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "fillWithBlurmy" && tab?.id) {
    console.log("Blurmy context menu clicked on tab:", tab.id);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"] // This will be the compiled JS file
    }).then(() => {
        console.log("Injected content script.");
        // Send a message to the content script after injection
        chrome.tabs.sendMessage(tab.id!, { action: "fillForm" });
    }).catch(err => console.error("Failed to inject content script:", err));
  }
});

// Listener for messages from popup or content scripts (if needed later)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background:", message);
  if (message.action === "loginSuccess") {
    // Handle login success, maybe store some session info
    console.log("User logged in successfully (message from popup).");
  }
  // Keep the message channel open for asynchronous response if needed
  // return true;
  return false; // For now, no async response needed
});

console.log("Blurmy background script loaded.");
