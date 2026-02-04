import TodaysSalesCard from "../components/TodaysSalesCard";
import BranchOverview from "../components/BranchOverview";
import UserStatsByRole from "../components/UserStatsByRole";
import TopBranchesChart from "../components/TopBranchesChart";
import CustomerRecurrenceChart from "../components/CustomerRecurrenceChart";
import TopManagersCard from "../components/TopManagersCard";
import AdminQuickActions from "../components/AdminQuickActions";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          System-wide overview and performance metrics
        </p>
      </div>

      {/* Row 1: Today's Sales, Branch Overview, Users by Role */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <TodaysSalesCard />
        <BranchOverview />
        <UserStatsByRole />
      </div>

      {/* Row 2: Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TopBranchesChart />
        <CustomerRecurrenceChart />
      </div>

      {/* Row 3: Top Managers + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TopManagersCard />
        <AdminQuickActions />
      </div>
    </div>
  );
}
