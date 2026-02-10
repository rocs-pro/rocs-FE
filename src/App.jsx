import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Global Notification System
import { GlobalNotificationProvider } from './context/GlobalNotificationContext';
import GlobalToastNotification from './components/GlobalToastNotification';

// Auth Pages
import Login from './auth/Login';
import RegisterScreen from './auth/RegisterScreen';

// Main Modules
import POSScreen from './pos/POSScreen';
import InventorySystem from './inventory/InventorySystem';

// Manager Dashboard
import ManagerLayout from './manager/layout/Layout';
import ManagerDashboard from './manager/ManagerDashboard';
import Approvals from './manager/pages/Approvals';
import BranchActivity from './manager/pages/BranchActivityLog';
import Sales from './manager/pages/Sales';
import SalesReports from './manager/pages/SalesReports';
import ChartOfAccounts from './manager/pages/ChartOfAccounts';
import JournalEntry from './manager/pages/JournalEntry';
import ProfitLoss from './manager/pages/ProfitLoss';
import OtherReports from './manager/pages/Reports';
import UserRegistrations from './manager/pages/UserRegistrations';
import Loyalty from './manager/pages/Loyalty';
import ManagerPayments from './manager/pages/ManagerPayments';


// Admin Dashboard
import AdminDashboard from './admin/AdminDashboard';

// Context
import { NotificationProvider } from './pos/context/NotificationContext';

// =====================================================
// PROTECTED ROUTE COMPONENT
// =====================================================
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  // No token = redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if user has permission
  if (allowedRoles.length > 0 && userStr) {
    try {
      const user = JSON.parse(userStr);
      const userRole = (user.role || user.userRole || '').toUpperCase();

      if (!allowedRoles.includes(userRole)) {
        // Redirect to their appropriate dashboard
        return <Navigate to={getRoleDefaultRoute(userRole)} replace />;
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }

  return children;
};

// =====================================================
// ROLE-BASED REDIRECT COMPONENT
// =====================================================
const RoleBasedRedirect = () => {
  const userStr = localStorage.getItem('user');

  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    const role = (user.role || user.userRole || '').toUpperCase();
    const targetRoute = getRoleDefaultRoute(role);
    return <Navigate to={targetRoute} replace />;
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
};

// =====================================================
// HELPER: Get default route for role
// =====================================================
function getRoleDefaultRoute(role) {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'BRANCH_MANAGER':
      return '/manager';
    case 'STORE_KEEPER':
      return '/inventory';
    case 'CASHIER':
    case 'SUPERVISOR':
    default:
      return '/pos';
  }
}

// =====================================================
// MAIN APP COMPONENT
// =====================================================
export default function App() {
  return (
    <GlobalNotificationProvider>
      <BrowserRouter>
        <Routes>
          {/* ========== PUBLIC ROUTES ========== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterScreen />} />

          {/* ========== DEFAULT REDIRECT ========== */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ========== POS SYSTEM (Cashier, Supervisor) ========== */}
          <Route
            path="/pos"
            element={
              <ProtectedRoute allowedRoles={['CASHIER', 'SUPERVISOR', 'ADMIN', 'BRANCH_MANAGER']}>
                <POSScreen />
              </ProtectedRoute>
            }
          />

          {/* ========== INVENTORY (Store Keeper, Admin, Manager) ========== */}
          <Route
            path="/inventory/*"
            element={
              <ProtectedRoute allowedRoles={['STORE_KEEPER', 'ADMIN', 'BRANCH_MANAGER']}>
                <InventorySystem />
              </ProtectedRoute>
            }
          />

          {/* ========== ADMIN DASHBOARD ========== */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ========== MANAGER DASHBOARD ========== */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={['BRANCH_MANAGER']}>
                <NotificationProvider>
                  <ManagerLayout />
                </NotificationProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<ManagerDashboard />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="branch-activity" element={<BranchActivity />} />
            <Route path="sales" element={<Sales />} />
            <Route path="sales-reports" element={<SalesReports />} />
            <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
            <Route path="journal-entry" element={<JournalEntry />} />
            <Route path="profit-loss" element={<ProfitLoss />} />
            <Route path="manager-payments" element={<ManagerPayments />} />
            <Route path="loyalty" element={<Loyalty />} />
            <Route path="user-registrations" element={<UserRegistrations />} />
            <Route path="reports" element={<OtherReports />} />
          </Route>

          {/* ========== CATCH-ALL: 404 ========== */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-slate-300 mb-4">404</h1>
                  <p className="text-slate-600 mb-6">Page not found</p>
                  <a
                    href="/login"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Go to Login
                  </a>
                </div>
              </div>
            }
          />
        </Routes>

        {/* Global Toast Notification Component */}
        <GlobalToastNotification />
      </BrowserRouter>
    </GlobalNotificationProvider>
  );
}
