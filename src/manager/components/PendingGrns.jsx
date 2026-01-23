import Badge from "./Badge";
import { pendingGrns } from "../data/managerMockData";

export default function PendingGrns() {
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
      <div className="font-bold mb-3">Pending GRNs</div>
      <div className="space-y-3">
        {pendingGrns.map((g) => (
          <div key={g.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
            <div>
              <div className="font-bold">{g.id}</div>
              <div className="text-xs text-brand-muted">{g.supplier} • {g.items} items</div>
            </div>
            <Badge label={g.eta === "Today" ? "Warning" : "Success"} />
          </div>
        ))}
      </div>
    </div>
  );
}
