import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './screens/Login';
import RegisterScreen from './auth/RegisterScreen';
import Dashboard from './dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/inventory" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;