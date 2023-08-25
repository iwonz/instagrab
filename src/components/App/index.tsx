import { createRoot } from 'react-dom/client';
import * as React from 'react';
import { App } from './App';
import { APP_ROOT_ID } from '../../utils/constants';

export const renderApp = () => {
  let rootElement = document.querySelector(`#${APP_ROOT_ID}`);
  if (rootElement) {
    document.body.removeChild(rootElement);
  }

  rootElement = document.createElement('div');
  rootElement.id = APP_ROOT_ID;
  const root = createRoot(rootElement);

  root.render(
    <>
      <App />
    </>,
  );

  document.body.appendChild(rootElement);
};
