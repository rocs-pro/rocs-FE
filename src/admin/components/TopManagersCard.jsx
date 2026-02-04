import { useState, useEffect } from "react";
import { getTopManagers } from "../services/adminApi";

const MEDAL_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"];

const ManagerCard = ({ manager, rank }) => {
  const isMedalist = rank <= 3;
  const medalColor = MEDAL_COLORS[rank - 1];

  const initials = (manager.name || manager.fullName || "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2);

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md ${
        rank === 1
          ? "bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200"
          : "bg-gray-50 hover:bg-gray-100"
      }`}
    >
      {/* Rank Badge */}
      <div className="relative">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
            rank === 1
              ? "bg-gradient-to-br from-amber-400 to-amber-600"
              : rank === 2
              ? "bg-gradient-to-br from-gray-300 to-gray-500"
              : rank === 3
              ? "bg-gradient-to-br from-amber-600 to-amber-800"
              : "bg-brand-primary"
          }`}
        >
          {initials}
        </div>
        {isMedalist && (
          <div
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white"
            style={{ backgroundColor: medalColor }}
          >
            {rank}
          </div>
        )}
      </div>

      {/* Manager Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800 truncate">{manager.name || manager.fullName}</span>
        </div>
        <div className="text-sm text-gray-500 truncate">{manager.branch || manager.branchName}</div>
      </div>

      {/* Stats */}
      <div className="text-right">
        <div className="font-bold text-green-600">
          LKR {((manager.sales || 0) / 1000).toFixed(0)}K
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 justify-end">
          <span>{manager.rating || 0} rating</span>
          <span className="text-gray-300">|</span>
          <span>{manager.transactions || 0} txns</span>
        </div>
      </div>
    </div>
  );
};

export default function TopManagersCard() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTopManagers();
        setManagers(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch top managers:", err);
        setError("Failed to load data");
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
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
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

  const totalSales = managers.reduce((acc, m) => acc + (m.sales || 0), 0);

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Top Performing Managers</h3>
          <p className="text-sm text-gray-500">Based on today's sales</p>
        </div>
      </div>

      {managers.length > 0 ? (
        <>
          <div className="space-y-3">
            {managers.map((manager, index) => (
              <ManagerCard key={manager.userId || manager.id || index} manager={manager} rank={index + 1} />
            ))}
          </div>

          {/* Summary Footer */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Total Manager Sales Today</span>
              <span className="font-bold text-brand-primary">
                LKR {totalSales.toLocaleString()}
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="py-8 text-center text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
}
