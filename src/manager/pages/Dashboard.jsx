import { useEffect, useState } from "react";
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

import { getDashboardStats, getSalesData } from "../../services/managerService";

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [statsResponse, salesResponse] = await Promise.all([
          getDashboardStats(),
          getSalesData("weekly"),
        ]);

        // Handle stats response - convert object to array if needed
        let statsArray = [];
        if (Array.isArray(statsResponse)) {
          statsArray = statsResponse;
        } else if (statsResponse && typeof statsResponse === 'object') {
          // If it's a single object, wrap it in an array
          statsArray = [statsResponse];
        }
        
        // Handle sales response - ensure it's an array
        let salesArray = [];
        if (Array.isArray(salesResponse)) {
          salesArray = salesResponse;
        } else if (salesResponse && typeof salesResponse === 'object') {
          // If response has a 'data' property, extract it
          if (Array.isArray(salesResponse.data)) {
            salesArray = salesResponse.data;
          } else if (typeof salesResponse.value === 'number') {
            // If it's a single object with value property, convert to array
            salesArray = [salesResponse.value];
          }
        }
        
        setStats(statsArray);
        setSalesData(salesArray);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="space-y-5">
        <h1 className="text-xl font-extrabold">Manager Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

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
        {loading ? (
          <div className="col-span-full text-center text-brand-muted">Loading stats...</div>
        ) : (
          stats.map((s, i) => (
            <StatCard key={i} title={s.title} value={s.value} icon={s.icon} tone={s.tone} />
          ))
        )}
      </div>

      {/* Charts + Top selling */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BranchSalesChart data={salesData} />
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
