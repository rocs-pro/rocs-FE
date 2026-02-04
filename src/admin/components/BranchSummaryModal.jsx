import { useState, useEffect } from "react";
import { getBranchRealTimeSales } from "../services/adminApi";

export default function BranchSummaryModal({ branch, onClose }) {
  const [branchData, setBranchData] = useState(branch);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Real-time sales updates
  useEffect(() => {
    const fetchRealTimeSales = async () => {
      const branchId = branch?.branchId || branch?.id;
      if (!branchId) return;

      try {
        setLoading(true);
        const data = await getBranchRealTimeSales(branchId);
        setBranchData((prev) => ({
          ...prev,
          dailySales: data.dailySales,
          activeTerminals: data.activeTerminals,
          registeredCustomers: data.registeredCustomers,
        }));
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Failed to fetch real-time sales:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRealTimeSales();

    const interval = setInterval(fetchRealTimeSales, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, [branch]);

  const formatCurrency = (value) => `LKR ${(value || 0).toLocaleString()}`;
  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const users = branchData?.users || [];
  const activeUsers = users.filter((u) => u.status === "Active" || u.accountStatus === "ACTIVE").length;
  const totalUsers = users.length;

  const manager = branchData?.manager || {};
  const isActive = branchData?.isActive || branchData?.status === "Active";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{branchData?.name || "Branch"}</h2>
              <p className="text-blue-200 text-sm">{branchData?.address || branchData?.location || ""}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Daily Sales - Real-time */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 mb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium mb-1">
                  Daily Total Sales
                </p>
                <div className="text-3xl font-extrabold text-green-800">
                  {loading ? "..." : formatCurrency(branchData?.dailySales)}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Live Updates
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Last: {formatTime(lastUpdated)}
                </p>
              </div>
            </div>
          </div>

          {/* Manager Section */}
          <div className="mb-5">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              Assigned Manager
            </h3>
            {manager?.name ? (
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                <div className="w-14 h-14 bg-brand-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {manager.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-800">
                    {manager.name || manager.fullName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {manager.email}
                  </div>
                  <div className="text-sm text-gray-500">
                    {manager.phone}
                  </div>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Active
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl text-gray-500 text-center">
                No manager assigned
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-extrabold text-brand-primary">
                {branchData?.activeTerminals || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">Active Terminals</div>
              <div className="text-xs text-gray-400">
                of {branchData?.totalTerminals || 0} total
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-extrabold text-amber-600">
                {branchData?.registeredCustomers || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">Registered</div>
              <div className="text-xs text-gray-400">Customers</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-extrabold text-green-600">
                {activeUsers}
              </div>
              <div className="text-xs text-gray-500 mt-1">Active Users</div>
              <div className="text-xs text-gray-400">of {totalUsers} total</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-extrabold text-purple-600">
                {isActive ? "Active" : "Inactive"}
              </div>
              <div className="text-xs text-gray-500 mt-1">Branch Status</div>
              <div
                className={`text-xs ${
                  isActive ? "text-green-500" : "text-red-500"
                }`}
              >
                {isActive ? "Operational" : "Closed"}
              </div>
            </div>
          </div>

          {/* Users in Branch */}
          <div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              Users in Branch ({totalUsers})
            </h3>
            {users.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.userId || user.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-brand-soft rounded-full flex items-center justify-center text-brand-primary text-sm font-bold">
                        {(user.name || user.fullName || "U")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">
                          {user.name || user.fullName}
                        </div>
                        <div className="text-xs text-gray-500">{user.role}</div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === "Active" || user.accountStatus === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {user.status || user.accountStatus}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl text-gray-500 text-center">
                No users assigned to this branch
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>Branch ID: {branchData?.branchId || branchData?.id || branchData?.code}</span>
            <span>Created: {branchData?.createdAt ? new Date(branchData.createdAt).toLocaleDateString() : branchData?.openedAt || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
