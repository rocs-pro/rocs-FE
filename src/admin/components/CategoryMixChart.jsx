import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import { categoryMix } from "../data/mockData";

const COLORS = ["#1F3C88", "#2563EB", "#16A34A", "#F59E0B"];

export default function CategoryMixChart() {
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
      <div className="font-bold mb-3">Sales by Category</div>

      <div style={{ width: '100%', height: '288px', minHeight: '288px' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={0}>
          <PieChart>
            <Pie
              data={categoryMix}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {categoryMix.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
