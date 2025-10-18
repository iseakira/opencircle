import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App.jsx';
import Login from './Login.jsx';
import { BrowserRouter,Route, Routes } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Login" element={<Login />} />
      </Routes>

    </BrowserRouter>
  </React.StrictMode>,
);
