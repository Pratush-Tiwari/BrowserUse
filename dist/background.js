import { a as t, g as n, d as c, e as a } from "./assets/firebase-DzbLkkD6.js";
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "fillWithBlurmy",
    title: "Fill with Blurmy Ai",
    contexts: ["page"],
  });
});
chrome.contextMenus.onClicked.addListener(async (s, r) => {
  if (s.menuItemId === "fillWithBlurmy" && r != null && r.id)
    try {
      const e = t.currentUser;
      if (!e) {
        chrome.tabs.sendMessage(r.id, { action: "showLoginPrompt" });
        return;
      }
      const o = await n(c(a, "users", e.uid));
      if (!o.exists()) {
        chrome.tabs.sendMessage(r.id, { action: "showProfilePrompt" });
        return;
      }
      const i = o.data();
      chrome.tabs.sendMessage(r.id, { action: "fillForm", profile: i });
    } catch (e) {
      console.error("Error in context menu handler:", e),
        chrome.tabs.sendMessage(r.id, {
          action: "showError",
          error: "Failed to load profile data",
        });
    }
});
chrome.runtime.onMessage.addListener((s, r, e) => {
  if (s.action === "getUserProfile") {
    const o = t.currentUser;
    e(o ? { user: o } : { user: null });
  }
  if (s.action === "signOut")
    return (
      t
        .signOut()
        .then(() => {
          e({ success: !0 });
        })
        .catch((o) => {
          e({ success: !1, error: o.message });
        }),
      !0
    );
});
t.onAuthStateChanged((s) => {
  s ? console.log("User signed in:", s.email) : console.log("User signed out");
});
