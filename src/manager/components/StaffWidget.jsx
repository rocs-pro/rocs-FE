import Badge from "./Badge";
import { staffSummary } from "../data/managerMockData";

export default function StaffWidget() {
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
      <div className="font-bold mb-3">Staff Activity</div>

      <div className="space-y-3">
        {staffSummary.slice(0, 4).map((s) => (
          <div key={s.name} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
            <div>
              <div className="font-bold">{s.name} <span className="text-xs text-brand-muted">({s.role})</span></div>
              <div className="text-xs text-brand-muted">Last login: {s.lastLogin}</div>
            </div>
            <Badge label={s.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
