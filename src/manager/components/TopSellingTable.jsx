import { topSellingProducts } from "../data/managerMockData";

export default function TopSellingTable() {
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 font-bold">Top Selling Products (This Week)</div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left p-3">Product</th>
              <th className="text-left p-3">Units</th>
              <th className="text-left p-3">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {topSellingProducts.map((p, i) => (
              <tr key={i} className="border-t hover:bg-slate-50">
                <td className="p-3 font-bold">{p.name}</td>
                <td className="p-3">{p.units}</td>
                <td className="p-3">{p.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
