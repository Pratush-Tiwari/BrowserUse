// Content script for form filling functionality

interface UserProfile {
  email: string;
  rawProfileData: string;
  apiKey: string;
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
  switch (request.action) {
    case "fillForm":
      fillFormWithProfile(request.profile);
      break;
    case "showLoginPrompt":
      showNotification("Please log in to Blurmy first", "error");
      break;
    case "showProfilePrompt":
      showNotification("Please complete your profile in Blurmy", "warning");
      break;
    case "showError":
      showNotification(request.error, "error");
      break;
  }
});

function fillFormWithProfile(profile: UserProfile) {
  const formFields = document.querySelectorAll("input, textarea, select");
  let filledCount = 0;

  formFields.forEach((field) => {
    const element = field as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    const fieldName = element.name?.toLowerCase() || "";
    const fieldId = element.id?.toLowerCase() || "";
    const fieldType = element.type?.toLowerCase() || "";

    // Skip hidden fields and buttons
    if (
      element.type === "hidden" ||
      element.type === "submit" ||
      element.type === "button"
    ) {
      return;
    }

    // For now, we'll use a simple approach to extract data from rawProfileData
    // In a real implementation, you'd use AI to parse the text and extract relevant information
    let value = "";

    // Basic field matching - this would be enhanced with AI parsing
    if (fieldType === "email") {
      value = profile.email;
    } else if (fieldName.includes("name") || fieldId.includes("name")) {
      // Extract name from rawProfileData using simple regex
      const nameMatch = profile.rawProfileData.match(/name is ([A-Za-z\s]+)/i);
      if (nameMatch) {
        value = nameMatch[1].trim();
      }
    }

    // Fill the field if we found a match
    if (value && value.trim()) {
      element.value = value;

      // Trigger change events
      element.dispatchEvent(new Event("input", { bubbles: true }));
      element.dispatchEvent(new Event("change", { bubbles: true }));

      filledCount++;
    }
  });

  // Show success notification
  if (filledCount > 0) {
    showNotification(`Successfully filled ${filledCount} fields!`, "success");
  } else {
    showNotification("No matching fields found to fill", "info");
  }
}

function showNotification(
  message: string,
  type: "success" | "error" | "warning" | "info"
) {
  // Remove existing notification
  const existingNotification = document.getElementById("blurmy-notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.id = "blurmy-notification";
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 16px;
    border-radius: 8px;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    z-index: 10000;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: blurmy-slide-in 0.3s ease-out;
  `;

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.backgroundColor = "#10b981";
      break;
    case "error":
      notification.style.backgroundColor = "#ef4444";
      break;
    case "warning":
      notification.style.backgroundColor = "#f59e0b";
      break;
    case "info":
      notification.style.backgroundColor = "#3b82f6";
      break;
  }

  notification.textContent = message;

  // Add CSS animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes blurmy-slide-in {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  // Add to page
  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "blurmy-slide-out 0.3s ease-in";
      notification.style.animationFillMode = "forwards";

      const slideOutStyle = document.createElement("style");
      slideOutStyle.textContent = `
        @keyframes blurmy-slide-out {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(slideOutStyle);

      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

// Initialize content script
console.log("Blurmy content script loaded");
