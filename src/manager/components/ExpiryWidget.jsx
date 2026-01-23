import Badge from "./Badge";
import { expiryAlerts } from "../data/managerMockData";

export default function ExpiryWidget() {
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
      <div className="font-bold mb-3">Expiry Alerts</div>

      <div className="space-y-3">
        {expiryAlerts.map((e, i) => (
          <div key={i} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
            <div className="min-w-0">
              <div className="font-semibold">{e.item}</div>
              <div className="text-xs text-brand-muted">Expires: {e.expiresOn} • Qty: {e.qty}</div>
            </div>
            <Badge label={e.severity} />
          </div>
        ))}
      </div>
    </div>
  );
}
