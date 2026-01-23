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

export default function AppRouter() {
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
