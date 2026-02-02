import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout
import ManagerLayout from "./manager/layout/Layout";

// Pages
import ManagerDashboard from "./manager/ManagerDashboard";
import Approvals from "./manager/pages/Approvals";
import BranchActivity from "./manager/pages/BranchActivityLog";
import Sales from "./manager/pages/Sales";
import SalesReports from "./manager/pages/SalesReports";
import ChartOfAccounts from "./manager/pages/ChartOfAccounts";
import JournalEntry from "./manager/pages/JournalEntry";
import ProfitLoss from "./manager/pages/ProfitLoss";
import Staff from "./manager/pages/Staff";
import OtherReports from "./manager/pages/Reports";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Manager-only branch default */}
        <Route path="/" element={<Navigate to="/manager" replace />} />

        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerDashboard />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="branch-activity" element={<BranchActivity />} />
          <Route path="sales" element={<Sales />} />
          <Route path="sales-reports" element={<SalesReports />} />
          <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
          <Route path="journal-entry" element={<JournalEntry />} />
          <Route path="profit-loss" element={<ProfitLoss />} />
          <Route path="staff" element={<Staff />} />
          <Route path="reports" element={<OtherReports />} />
        </Route>

        <Route path="*" element={<div className="p-6">Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
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
