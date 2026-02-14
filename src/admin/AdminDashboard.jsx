import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import SystemActivityLog from "./pages/SystemActivityLog";
import Branches from "./pages/Branches";
import Terminals from "./pages/Terminals";
import PasswordRequests from "./pages/PasswordRequests";

export default function AdminDashboard() {
  return (
    <Layout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="overview" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="terminals" element={<Terminals />} />
        <Route path="system-activity" element={<SystemActivityLog />} />
        <Route path="branches" element={<Branches />} />
        <Route path="reports" element={<Reports />} />
        <Route path="password-requests" element={<PasswordRequests />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Layout>
  );
}