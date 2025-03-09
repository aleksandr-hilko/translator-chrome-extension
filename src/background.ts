/// <reference types="chrome" />

chrome.runtime.onInstalled.addListener(() => {
  console.log("[DEBUG] Extension installed - trying to add context menu");

  chrome.contextMenus.create(
    {
      id: "translate",
      title: "Translate",
      contexts: ["selection"],
      documentUrlPatterns: ["http://*/*", "https://*/*"] // ⬅️ Prevents running on chrome:// pages
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error("[ERROR] Failed to create context menu:", chrome.runtime.lastError.message);
      } else {
        console.log("[DEBUG] Context menu added successfully");
      }
    }
  );
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translate" && info.selectionText && tab?.id !== undefined) {
    console.log("[DEBUG] Context menu clicked with text:", info.selectionText);

    // Ensure we are not trying to execute on a chrome:// page
    if (tab.url?.startsWith("chrome://")) {
      console.warn("[WARNING] Cannot inject script into chrome:// pages");
      return;
    }

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: displayTranslation,
      args: [info.selectionText]
    }).catch(err => console.error("[ERROR] Failed to execute script:", err));
  }
});

function displayTranslation(selectedText: string) {
  console.log("[DEBUG] Running translation function with text:", selectedText);
  
  const translation = "translated"; // Mock response

  let popup = document.createElement("div");
  popup.innerText = `Translation: ${translation}`;
  popup.style.position = "fixed";
  popup.style.bottom = "20px";
  popup.style.right = "20px";
  popup.style.padding = "10px";
  popup.style.background = "yellow";
  popup.style.border = "1px solid black";
  popup.style.zIndex = "10000";

  document.body.appendChild(popup);

  setTimeout(() => popup.remove(), 3000);
}
