import { useEffect, useMemo, useState } from "react";
import { branches, seedActivity, seedUsers } from "../data/mockData";
import { ensureAdminSeed, getActivity } from "../../shared/storage";

const severityClass = (s) => {
  if (s === "Critical") return "bg-brand-danger";
  if (s === "Warning") return "bg-brand-warning";
  return "bg-slate-500";
};

export default function SystemActivityLog() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    ensureAdminSeed({ seedUsers, seedActivity, seedBranches: branches });
    setRows(getActivity());
  }, []);

  function refresh() {
    setRows(getActivity());
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchType = type === "All" ? true : r.type === type;
      if (!matchType) return false;
      if (!s) return true;
      return (
        (r.time || "").toLowerCase().includes(s) ||
        (r.actor || "").toLowerCase().includes(s) ||
        (r.type || "").toLowerCase().includes(s) ||
        (r.action || "").toLowerCase().includes(s)
      );
    });
  }, [rows, q, type]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold">System Activity (Merged Logs)</h1>
          <p className="text-sm text-brand-muted">
            Includes system actions and login history in one place.
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={refresh}
            className="hidden sm:inline-flex items-center justify-center px-3 py-2 rounded-xl bg-slate-100 border border-brand-border hover:bg-slate-200 transition text-sm font-bold"
          >
            Refresh
          </button>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-40 px-3 py-2 rounded-xl border border-brand-border bg-white text-sm"
          >
            <option>All</option>
            <option>System</option>
            <option>Security</option>
            <option>Login</option>
            <option>User</option>
            <option>Branch</option>
          </select>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search time / actor / type / action"
            className="flex-1 sm:w-80 px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
          />
        </div>
      </div>

      <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 font-bold">Audit Log</div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3">Time</th>
                <th className="text-left p-3">Actor</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Action</th>
                <th className="text-left p-3">Severity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-t hover:bg-slate-50">
                  <td className="p-3 text-brand-muted whitespace-nowrap">{e.time}</td>
                  <td className="p-3 font-mono text-xs whitespace-nowrap">{e.actor}</td>
                  <td className="p-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 border border-brand-border">
                      {e.type}
                    </span>
                  </td>
                  <td className="p-3">{e.action}</td>
                  <td className="p-3">
                    <span className={`text-xs px-3 py-1 rounded-full text-white font-bold ${severityClass(e.severity)}`}>
                      {e.severity}
                    </span>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-brand-muted" colSpan={5}>
                    No activity found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
