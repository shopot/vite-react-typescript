import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './main.scss';

import { App } from 'app/app';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
