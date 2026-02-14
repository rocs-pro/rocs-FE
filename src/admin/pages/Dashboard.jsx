import BranchCards from "../components/BranchCards";
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

      {/* Row 1: Branch Cards (full width) + Users by Role */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <BranchCards />
      </div>

      {/* Row 2: Users by Role */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <UserStatsByRole />
        <TopManagersCard />
        <AdminQuickActions />
      </div>

      {/* Row 3: Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TopBranchesChart />
        <CustomerRecurrenceChart />
      </div>
    </div>
  );
}
