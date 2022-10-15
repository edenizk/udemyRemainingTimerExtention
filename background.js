chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.onActivated.addListener(async info => {
    const tab = await chrome.tabs.get(info.tabId);
    
    const isGithub = tab.url.startsWith('https://github.com/');
    isGithub 
      ? chrome.action.enable(tab.tabId) 
      : chrome.action.disable(tab.tabId);
  });
});