import { createRoot } from 'react-dom/client';
import React from 'react';
import AppRouter from './AppRouter.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './AppContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider />
    </BrowserRouter>
  </React.StrictMode>
);
