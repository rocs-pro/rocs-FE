import { useState, useEffect } from "react";
import { getTodaysSales, getWeeklySalesTrend } from "../services/adminApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TodaysSalesCard() {
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    totalTransactions: 0,
    comparedToYesterday: 0,
  });
  const [weeklySalesTrend, setWeeklySalesTrend] = useState([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [todaySales, weeklyTrend] = await Promise.all([
          getTodaysSales(),
          getWeeklySalesTrend(),
        ]);
        setSalesData(todaySales);
        setWeeklySalesTrend(weeklyTrend);
        setLastUpdateTime(new Date());
        setError(null);
      } catch (err) {
        console.error("Failed to fetch sales data:", err);
        setError("Failed to load sales data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Real-time updates every 30 seconds
    const interval = setInterval(async () => {
      try {
        const todaySales = await getTodaysSales();
        setSalesData(todaySales);
        setLastUpdateTime(new Date());
      } catch (err) {
        console.error("Failed to refresh sales data:", err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value) => {
    return `LKR ${(value || 0).toLocaleString()}`;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-brand-primary via-blue-600 to-blue-800 rounded-2xl shadow-xl p-6 text-white animate-pulse">
        <div className="h-6 bg-white/20 rounded w-3/4 mb-4"></div>
        <div className="h-10 bg-white/20 rounded w-1/2 mb-4"></div>
        <div className="h-20 bg-white/10 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-2xl shadow-xl p-6 text-white">
        <p className="text-lg font-bold">Error Loading Data</p>
        <p className="text-sm text-red-200">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-brand-primary via-blue-600 to-blue-800 rounded-2xl shadow-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold">Today's Total Sales</h3>
          <p className="text-xs text-blue-200">All Branches Combined</p>
        </div>
        <div className="text-right">
          <div className={`flex items-center gap-1 text-sm font-medium ${salesData.comparedToYesterday >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            <span>{salesData.comparedToYesterday >= 0 ? '↑' : '↓'}</span>
            <span>{Math.abs(salesData.comparedToYesterday || 0)}%</span>
          </div>
          <p className="text-xs text-blue-200">vs yesterday</p>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-4xl font-extrabold tracking-tight">
          {formatCurrency(salesData.totalSales)}
        </div>
        <div className="flex items-center gap-4 mt-2 text-sm text-blue-200">
          <span>{salesData.totalTransactions || 0} transactions</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Live
          </span>
        </div>
      </div>

      {/* Mini Weekly Trend Chart */}
      {weeklySalesTrend.length > 0 && (
        <div className="bg-white/10 rounded-xl p-3 mt-4">
          <p className="text-xs text-blue-200 mb-2">Weekly Trend</p>
          <div style={{ width: "100%", height: "80px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklySalesTrend}>
                <XAxis dataKey="day" tick={{ fill: "#93C5FD", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F3C88",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value) => [`LKR ${(value || 0).toLocaleString()}`, "Sales"]}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#93C5FD"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-blue-300 text-right">
        Last updated: {formatTime(lastUpdateTime)}
      </div>
    </div>
  );
}
