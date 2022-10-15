chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.onActivated.addListener(async info => {
    const tab = await chrome.tabs.get(info.tabId);

    const isUdemy = tab.url.includes('udemy.com/course');
    if (isUdemy) {
      chrome.action.setIcon({path: 'icon.png'});
      chrome.action.enable(tab.tabId);
    } else {
      chrome.action.setIcon({path: 'icon_disabled.png'});
      chrome.action.disable(tab.tabId);
    };
  });
});