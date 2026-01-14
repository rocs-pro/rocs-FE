import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Imports
import RegisterScreen from './auth/RegisterScreen';

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Redirect root to /register for testing */}
        <Route path="/" element={<Navigate to="/register" replace />} />
        
        {/* 2. Registration Route */}
        <Route path="/register" element={<RegisterScreen />} />
      
      </Routes>
    </Router>
  );
}

export default App;