import { MessageType } from './types';
import './store/init';
import { renderApp } from './components/App';
import { setPathName } from './store/page';

window.addEventListener('load', () => {
  renderApp();
});

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === MessageType.URL_CHANGED) {
    setPathName(window.location.pathname);

    return;
  }
});
