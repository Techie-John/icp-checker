// content.js — extracts full visible text from the LinkedIn profile page

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractText") {
    // Grab all visible text on the page — no fragile selectors
    const fullText = document.body.innerText
      .replace(/\n{3,}/g, "\n\n") // collapse excessive blank lines
      .trim()
      .substring(0, 6000); // cap at 6000 chars to stay within token limits
    sendResponse({ fullText });
  }
  return true;
});
