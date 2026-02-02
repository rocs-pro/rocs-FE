import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Debug logging for app initialization
console.log('=== ROCS Frontend Starting ===');
console.log('Environment:', import.meta.env.MODE);
console.log('Backend API Base URL: http://localhost:8080/api/inventory');
console.log('Token in localStorage:', localStorage.getItem('token') ? 'EXISTS' : 'NOT FOUND');
console.log('==================================');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
