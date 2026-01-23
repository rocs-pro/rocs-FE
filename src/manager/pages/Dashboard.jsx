import StatCard from "../components/StatCard";
import TargetProgress from "../components/TargetProgress";
import BranchSalesChart from "../components/BranchSalesChart";
import TopSellingTable from "../components/TopSellingTable";
import StockAlertsWidget from "../components/StockAlertsWidget";
import AlertsWidget from "../components/AlertsWidget";
import ExpiryWidget from "../components/ExpiryWidget";
import StaffWidget from "../components/StaffWidget";
import PendingGrns from "../components/PendingGrns";
import QuickActionsPanel from "../components/QuickActionsPanel";

import { managerStats, managerWeeklySales } from "../data/managerMockData";

export default function Dashboard() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-extrabold">Manager Dashboard</h1>
          <p className="text-sm text-brand-muted">
            Branch-focused view: sales summary, approvals, and operational alerts.
          </p>
        </div>
        <div className="text-xs text-brand-muted">
          Tip: Use <span className="font-bold">Quick</span> button in the top bar to create GRN requests.
        </div>
      </div>

      {/* Target progress (manager-specific) */}
      <TargetProgress />

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {managerStats.map((s, i) => (
          <StatCard key={i} title={s.title} value={s.value} icon={s.icon} tone={s.tone} />
        ))}
      </div>

      {/* Charts + Top selling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BranchSalesChart data={managerWeeklySales} />
        </div>
        <div className="lg:col-span-1 space-y-4">
          <PendingGrns />
          <QuickActionsPanel />
        </div>
      </div>

      {/* Tables/widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TopSellingTable />
        </div>
        <div className="lg:col-span-1 space-y-4">
          <AlertsWidget />
          <ExpiryWidget />
          <StockAlertsWidget />
          <StaffWidget />
        </div>
      </div>
    </div>
  );
}
