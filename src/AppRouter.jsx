import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./admin/AdminDashboard";


/**
 * One app, multiple dashboards.
 * - /admin/*   => Admin dashboard (system configuration, governance)
 * - /manager/* => Manager dashboard (branch operations)
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />

        <Route path="/admin/*" element={<AdminDashboard />} />

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
