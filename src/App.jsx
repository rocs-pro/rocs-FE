import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterScreen from './auth/RegisterScreen';

// Import Pages
import POSScreen from './pos/POSScreen';
import Login from './auth/Login';
import Dashboard from './dashboard/Dashboard';

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
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterScreen />} />

        {/* DEFAULT: Redirect to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* PROTECTED: Dashboard (Inventory) */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* PROTECTED: POS System */}
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