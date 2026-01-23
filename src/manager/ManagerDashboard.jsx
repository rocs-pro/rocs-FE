// import { Navigate, Route, Routes } from "react-router-dom";
// import Layout from "./layout/Layout";

// import Dashboard from "./pages/Dashboard";
// import Sales from "./pages/Sales";
// import Staff from "./pages/Staff";
// import Reports from "./pages/Reports";

// import Approvals from "./pages/Approvals";
// import BranchActivityLog from "./pages/BranchActivityLog";
// import ChartOfAccounts from "./pages/ChartOfAccounts";
// import JournalEntry from "./pages/JournalEntry";
// import ProfitLoss from "./pages/ProfitLoss";
// import SalesReports from "./pages/SalesReports";


// /**
//  * Manager dashboard (branch-focused).
//  * NOTE: No User Management here (that's admin-only).
//  */
// export default function ManagerDashboard() {
//   return (
//     <Layout>
//       <Routes>
//         <Route index element={<Dashboard />} />

//         {/* Operations */}
//         <Route path="approvals" element={<Approvals />} />
//         <Route path="branch-activity" element={<BranchActivityLog />} />

//         {/* Sales */}
//         <Route path="sales" element={<Sales />} />
//         <Route path="sales-reports" element={<SalesReports />} />
//         <Route path="staff" element={<Staff />} />
//         <Route path="reports" element={<Reports />} />

//         {/* Accounting */}
//         <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
//         <Route path="journal-entry" element={<JournalEntry />} />
//         <Route path="profit-loss" element={<ProfitLoss />} />

//         <Route path="*" element={<Navigate to="/manager" replace />} />
//       </Routes>
//     </Layout>
//   );
// }
import Dashboard from "./pages/Dashboard";

/**
 * Manager dashboard entry page (Overview).
 * NOTE:
 * - Do NOT put <Layout> or <Routes> here.
 * - Routing is handled in src/AppRouter.jsx under /manager with <Outlet />.
 */
export default function ManagerDashboard() {
  return <Dashboard />;
}
