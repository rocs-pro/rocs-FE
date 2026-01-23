import StatCard from "../components/StatCard";
import { stats, weeklySales } from "../data/mockData";
import ChartBox from "../components/ChartBox";
import StaffActivity from "../components/StaffActivity";
import StockAlerts from "../components/StockAlerts";
import QuickActions from "../components/QuickActions";
import CategoryMixChart from "../components/CategoryMixChart";

export default function Dashboard() {
  return (
    <div className="space-y-5">
      <h1 className="text-xl font-extrabold">Admin Dashboard</h1>

      {/* Sales Overview Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={i} title={s.title} value={s.value} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartBox data={weeklySales} />
        </div>
        <div className="lg:col-span-1">
          <CategoryMixChart />
        </div>
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StaffActivity />
        <StockAlerts />
        <QuickActions />
      </div>
    </div>
  );
}
