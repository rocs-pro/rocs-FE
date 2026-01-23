import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function BranchSalesChart({ data }) {
  const chartData = data.map((value, i) => ({ day: days[i], sales: value }));

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="font-bold">Branch Weekly Sales</div>
        <span className="text-xs px-3 py-1 rounded-full bg-slate-100 border border-brand-border font-bold">
          💰 Sales
        </span>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#2563EB" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
