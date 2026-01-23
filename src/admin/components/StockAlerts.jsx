import { stockAlerts } from "../data/mockData";

const levelClass = (level) =>
  level === "Critical" ? "bg-brand-danger" : "bg-brand-warning";

export default function StockAlerts() {
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
      <div className="font-bold mb-3">Stock Alert Indicators</div>

      <div className="space-y-3">
        {stockAlerts.map((a, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
          >
            <div>
              <div className="font-bold">{a.item}</div>
              <div className="text-xs text-brand-muted">Only {a.qty} left</div>
            </div>

            <span
              className={`text-xs px-3 py-1 rounded-full text-white font-bold ${levelClass(
                a.level
              )}`}
            >
              {a.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
