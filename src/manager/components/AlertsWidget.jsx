import Badge from "./Badge";
import { branchAlerts } from "../data/managerMockData";

export default function AlertsWidget() {
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
      <div className="font-bold mb-3">Alerts</div>

      <div className="space-y-3">
        {branchAlerts.map((a, i) => (
          <div key={i} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
            <div className="min-w-0">
              <div className="font-semibold">{a.message}</div>
              <div className="text-xs text-brand-muted">{a.time}</div>
            </div>
            <Badge label={a.type} />
          </div>
        ))}
      </div>
    </div>
  );
}
