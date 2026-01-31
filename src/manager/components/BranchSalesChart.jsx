import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function BranchSalesChart({ data = [] }) {
  // Ensure data is always an array and has at least some values
  const safeData = Array.isArray(data) && data.length > 0 ? data : [0, 0, 0, 0, 0, 0, 0];
  const chartData = safeData.map((value, i) => ({ day: days[i] || `D${i+1}`, sales: value || 0 }));

  // Don't render chart if there's no valid data structure
  const hasValidData = Array.isArray(data) && data.length > 0;

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="font-bold">Branch Weekly Sales</div>
        <span className="text-xs px-3 py-1 rounded-full bg-slate-100 border border-brand-border font-bold">
          💰 Sales
        </span>
      </div>

      {/* Fixed height container with explicit dimensions to prevent recharts errors */}
      <div className="w-full" style={{ height: '288px', minHeight: '288px' }}>
        {!hasValidData ? (
          <div className="flex items-center justify-center h-full text-brand-muted text-sm">
            No sales data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
