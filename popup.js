document.addEventListener("DOMContentLoaded", function () {
  const jsonBtn = document.getElementById("jsonBtn");
  const csvBtn = document.getElementById("csvBtn");
  const txtBtn = document.getElementById("txtBtn");

  if (jsonBtn) {
    jsonBtn.addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { action: "scrapPlaylistJson" });
      });
    });
    csvBtn.addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { action: "scrapPlaylistCsv" });
      });
    });
    txtBtn.addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { action: "scrapPlaylistTxt" });
      });
    });
  }
});
