import { useState, useEffect } from "react";
import { getUserStatsByRole } from "../services/adminApi";

const RoleBadge = ({ label, count, color }) => (
  <div className={`flex flex-col items-center justify-center p-4 rounded-xl ${color} transition-transform hover:scale-105`}>
    <div className="text-2xl font-extrabold text-gray-800">{(count || 0).toLocaleString()}</div>
    <div className="text-sm font-medium text-gray-600 text-center">{label}</div>
  </div>
);

export default function UserStatsByRole() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    loyaltyCustomers: 0,
    managers: 0,
    cashiers: 0,
    storeKeepers: 0,
    admins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getUserStatsByRole();
        setStats(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user stats:", err);
        setError("Failed to load user statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-5"></div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-2xl shadow-sm p-6">
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Users by Role</h3>
          <p className="text-sm text-gray-500">Total registered: {stats.totalUsers}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <RoleBadge
          label="Loyalty Customers"
          count={stats.loyaltyCustomers}
          color="bg-gradient-to-br from-amber-100 to-amber-50"
        />
        <RoleBadge
          label="Managers"
          count={stats.managers}
          color="bg-gradient-to-br from-blue-100 to-blue-50"
        />
        <RoleBadge
          label="Cashiers"
          count={stats.cashiers}
          color="bg-gradient-to-br from-green-100 to-green-50"
        />
        <RoleBadge
          label="Store Keepers"
          count={stats.storeKeepers}
          color="bg-gradient-to-br from-purple-100 to-purple-50"
        />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">System Admins</span>
          <span className="font-bold text-brand-primary">{stats.admins}</span>
        </div>
      </div>
    </div>
  );
}
