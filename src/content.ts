// src/content.ts
console.log("Blurmy content script loaded. Waiting for messages.");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in content script:", message);
  if (message.action === "fillForm") {
    alert("Blurmy action triggered! Attempting to fill form (placeholder).");
    // Placeholder for actual form filling logic
    // This is where DOM manipulation will happen.
    // For now, just log to the console.
    console.log("Blurmy attempting to fill form on page:", window.location.href);

    // Example: Find input fields (very basic)
    const inputFields = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    console.log(`Found ${inputFields.length} potential text input fields.`);

    // In a real scenario, you would iterate through these fields
    // and match them with data from the user's profile.
    // For now, we'll just highlight them.
    inputFields.forEach(field => {
      const inputElement = field as HTMLInputElement;
      // inputElement.style.border = "2px solid blue"; // Example modification
      console.log(`Field Name: ${inputElement.name}, ID: ${inputElement.id}, Placeholder: ${inputElement.placeholder}`);
    });

    // Send a response back to the background script (optional)
    sendResponse({ status: "Form fill action initiated" });
  }
  return true; // Keep message channel open for async response if needed
});

// This function could be called directly if the script is injected and immediately run
// function main() {
//   console.log("Blurmy content script main function executed.");
// }
// main();
