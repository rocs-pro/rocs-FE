import React from 'react';
<<<<<<< HEAD
=======
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './screens/Login';
import RegisterScreen from './auth/RegisterScreen';
import Dashboard from './dashboard/Dashboard';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './screens/Login';
import RegisterScreen from './auth/RegisterScreen';

>>>>>>> c92f983fe384dd3b9771aa0c58e4399afeede9e5
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterScreen from './auth/RegisterScreen';

// Import Pages
import POSScreen from './pos/POSScreen';
import Login from './auth/Login';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/inventory" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/login" element={<Login />} />
        
        {/* REDIRECT: Default to POS if logged in, else Login */}
        <Route path="/" element={<Navigate to="/pos" replace />} />
        
        {/* TERMINAL ROUTE: Protected */}
        <Route 
          path="/pos" 
          element={
            <ProtectedRoute>
              <POSScreen />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;