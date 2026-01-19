import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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