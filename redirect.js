// --- SPACES TOOLBAR BUTTON ---

browser.spacesToolbar.addButton('GoogleMessages', {
  title: browser.i18n.getMessage("toolbarButtonTitle"),
  defaultIcons: "skin/google_messages_icon.svg",
  url: "https://messages.google.com/web/"
});

// --- USER-AGENT SPOOFING ---

browser.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    for (let header of details.requestHeaders) {
      if (header.name.toLowerCase() === "user-agent") {
        header.value = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/151.0";
        break;
      }
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["https://messages.google.com/web/*", "https://*.google.com/*"] },
  ["blocking", "requestHeaders"]
);

// --- CONTEXT MENU CODE ---

browser.menus.create({
  id: "send-to-google-messages",
  title: browser.i18n.getMessage("contextMenuTitle"),
  contexts: ["selection"]
});

browser.menus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "send-to-google-messages" && info.selectionText) {
    const query = encodeURIComponent(info.selectionText);
    const messagesUrl = `https://messages.google.com/web/?text=${query}`;
    browser.tabs.create({ url: messagesUrl });
  }
});

// --- GOOGLE MESSAGES NOTIFICATION CODE ---
//
// Google Messages for web badges its tab title with an unread count,
// e.g. "(3) Messages for web". We notify when the count increases, and
// reset tracking when the title returns to a clean (read) state.

const messagesState = new Map(); // tabId -> count

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.title && tab.url && tab.url.includes("messages.google.com")) {
    const title = changeInfo.title;

    // TEMPORARY: confirm the real title format, then remove this.
    console.log("Messages tab title:", JSON.stringify(title));

    const previousCount = messagesState.get(tabId) || 0;

    // Look for a count anywhere in the title, e.g. "(3) Messages for web"
    const match = title.match(/\((\d+)\+?\)/);
    const count = match ? parseInt(match[1], 10) : 0;

    if (count > previousCount) {
      const body = count === 1 ? "You have a new message."
                               : `You have ${count} new messages.`;
      browser.notifications.create("google-messages-unread-alert", {
        type: "basic",
        iconUrl: "skin/google_messages_icon.png",
        title: "Google Messages",
        message: body
      }).catch((error) => {
        console.error("Failed to create notification:", error);
      });
    }

    messagesState.set(tabId, count);
  }
});

// Clean up tracking when a tab is closed
browser.tabs.onRemoved.addListener((tabId) => {
  messagesState.delete(tabId);
});

// Focus the Google Messages tab when the notification is clicked
browser.notifications.onClicked.addListener((notificationId) => {
  if (notificationId === "google-messages-unread-alert") {
    browser.tabs.query({ url: "*://messages.google.com/*" }).then((tabs) => {
      if (tabs.length > 0) {
        browser.tabs.update(tabs[0].id, { active: true });
        if (tabs[0].windowId) {
          browser.windows.update(tabs[0].windowId, { focused: true });
        }
      }
    }).catch((error) => {
      console.error("Error focusing Google Messages tab via notification click: ", error);
    });
  }
});
