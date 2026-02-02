import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';

import Dashboard from './dashboard/control-dashboard/Dashboard';
import AdminDashboard from './admin/AdminDashboard';
import ManagerDashboard from './dashboard/manager-dashboard/ManagerDashboard';
import PosPage from './pos/PosPage';
import InventoryPage from './inventory/InventoryPage';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          <Route path="/pos" element={<PosPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
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
