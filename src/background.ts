import { MessageType } from './types';

chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo) {
    if (changeInfo.url || changeInfo.status === 'complete') {
      chrome.tabs.sendMessage(tabId, {
        type: MessageType.URL_CHANGED,
      });
    }
  },
);
