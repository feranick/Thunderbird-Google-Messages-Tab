browser.spacesToolbar.addButton('GoogleMessages', {
    title: "Google Messages",
    defaultIcons: "skin/google_messages_icon.svg",
    url: "https://messages.google.com/web/"
});

browser.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    for (let header of details.requestHeaders) {
      if (header.name.toLowerCase() === "user-agent") {
        header.value = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0";
        break;
      }
    }
    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["https://messages.google.com/web/*", "https://*.google.com/*"] },
  ["blocking", "requestHeaders"]
);
