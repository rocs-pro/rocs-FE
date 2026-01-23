import Badge from "./Badge";
import { branchStockAlerts } from "../data/managerMockData";

export default function StockAlertsWidget() {
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
      <div className="font-bold mb-3">Low Stock (Branch)</div>

      <div className="space-y-3">
        {branchStockAlerts.map((a, i) => (
          <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
            <div>
              <div className="font-bold">{a.item}</div>
              <div className="text-xs text-brand-muted">Only {a.qty} left</div>
            </div>
            <Badge label={a.level} />
          </div>
        ))}
      </div>
    </div>
  );
}
