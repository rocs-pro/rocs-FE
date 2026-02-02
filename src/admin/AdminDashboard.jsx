import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import PasswordReset from "./pages/PasswordReset";
import SystemActivityLog from "./pages/SystemActivityLog";
import Branches from "./pages/Branches";

export default function AdminDashboard() {
  return (
    <Layout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="overview" element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="password-reset" element={<PasswordReset />} />
        <Route path="system-activity" element={<SystemActivityLog />} />
        <Route path="branches" element={<Branches />} />
        <Route path="reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Layout>
  );
}
const AdminDashboard = () => {
  return <h1>Admin Dashboard Page</h1>;
};

export default AdminDashboard;
