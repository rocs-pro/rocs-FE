import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ChartBox({ data }) {
  const chartData = data.map((value, i) => ({
    day: days[i],
    sales: value
  }));

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
      <div className="font-bold mb-3">Weekly Sales</div>
      <div style={{ width: '100%', height: '288px', minHeight: '288px' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={0}>
          <LineChart data={chartData}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#1F3C88" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
