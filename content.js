const urlParams = new URLSearchParams(window.location.search);
const textToPaste = urlParams.get('text');

// Helper function to pierce through Web Components/Shadow DOMs 
// to find the Google Messages input box
function findInputBox(root = document) {
  // Check the current root level first
  let input = root.querySelector('textarea, [contenteditable="true"]');
  if (input) return input;

  // Recursively search inside any shadow roots we encounter
  const elements = root.querySelectorAll('*');
  for (const el of elements) {
    if (el.shadowRoot) {
      input = findInputBox(el.shadowRoot);
      if (input) return input;
    }
  }
  return null;
}

if (textToPaste) {
  // Check every 1 second instead of every 500ms
  const checkInterval = setInterval(() => {
    const inputBox = findInputBox();
    
    // We found the box! This means you clicked a conversation.
    if (inputBox) {
      clearInterval(checkInterval); 
      
      // Add a tiny 500ms delay to ensure the chat UI has fully animated/rendered
      setTimeout(() => {
        inputBox.focus();
        
        // Paste the text
        document.execCommand('insertText', false, textToPaste);
        
        // Clean up the URL parameter so it doesn't re-paste on a manual refresh
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }, 500);
    }
  }, 1000);

  // Give the user 2 full minutes (120,000 milliseconds) to select a conversation 
  // before the script stops trying.
  setTimeout(() => clearInterval(checkInterval), 120000);
}
