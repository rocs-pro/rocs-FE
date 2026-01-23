import { useEffect, useMemo, useState } from "react";
import { branches, seedActivity, seedUsers } from "../data/mockData";
import { ensureAdminSeed, getActivity } from "../../shared/storage";

const severityBadge = (severity) => {
  if (severity === "Critical") return "bg-brand-danger";
  if (severity === "Warning") return "bg-brand-warning";
  return "bg-brand-success";
};

export default function StaffActivity() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    ensureAdminSeed({ seedUsers, seedActivity, seedBranches: branches });
    setRows(getActivity());
  }, []);

  const recent = useMemo(() => {
    return rows.filter((e) => e.type === "Login").slice(0, 6);
  }, [rows]);

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
      <div className="font-bold mb-3">Staff Activity Summary</div>

      <div className="space-y-3">
        {recent.map((log, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
          >
            <div className="min-w-0">
              <div className="font-bold capitalize truncate">{log.actor}</div>
              <div className="text-xs text-brand-muted">{log.time}</div>
              <div className="text-xs text-brand-muted truncate">{log.action}</div>
            </div>

            <span
              className={`text-xs px-3 py-1 rounded-full text-white font-bold ${severityBadge(log.severity)}`}
            >
              {log.severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
