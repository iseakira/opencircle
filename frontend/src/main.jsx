import { createRoot } from 'react-dom/client';
import React from 'react';
import AppRouter from './AppRouter.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthStatus.jsx';
import {  AuthContext } from './AuthStatus.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider />
    </BrowserRouter>
  </React.StrictMode>
);
