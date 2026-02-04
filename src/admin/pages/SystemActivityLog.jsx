import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getActivityLogs, getAllBranches } from "../services/adminApi";

const severityClass = (s) => {
  if (s === "CRITICAL" || s === "Critical") return "bg-brand-danger";
  if (s === "WARNING" || s === "Warning") return "bg-brand-warning";
  return "bg-slate-500";
};

export default function SystemActivityLog() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [branch, setBranch] = useState("All");
  const [rows, setRows] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch activity logs and branches on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [logsData, branchesData] = await Promise.all([
          getActivityLogs(),
          getAllBranches(),
        ]);
        setRows(logsData || []);
        setBranches(branchesData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load activity logs");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  async function refresh() {
    try {
      setLoading(true);
      const filters = {};
      if (type !== "All") filters.type = type;
      if (branch !== "All") filters.branchId = branch;
      const data = await getActivityLogs(filters);
      setRows(data || []);
    } catch (err) {
      console.error("Error refreshing logs:", err);
    } finally {
      setLoading(false);
    }
  }

  // Filter logs based on search and filters
  const filtered = rows.filter((r) => {
    const matchType = type === "All" ? true : r.type === type;
    const matchBranch = branch === "All" ? true : (r.branchId || r.branch_id || r.branchName || r.branch_name) === branch;
    if (!matchType || !matchBranch) return false;
    
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return (
      (r.time || r.timestamp || "").toLowerCase().includes(s) ||
      (r.actor || r.actorName || r.actor_name || "").toLowerCase().includes(s) ||
      (r.type || "").toLowerCase().includes(s) ||
      (r.action || r.description || "").toLowerCase().includes(s)
    );
  });

  const getBranchId = (b) => b.branchId || b.branch_id;
  const getBranchName = (b) => b.branchName || b.branch_name;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );
  }

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
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-40 px-3 py-2 rounded-xl border border-brand-border bg-white text-sm"
          >
            <option value="All">All Branches</option>
            {branches.map((b) => (
              <option key={getBranchId(b)} value={getBranchId(b)}>{getBranchName(b)}</option>
            ))}
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
                <th className="text-left p-3">Branch</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Action</th>
                <th className="text-left p-3">Severity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, idx) => {
                const logId = e.id || e.logId || e.log_id || idx;
                const time = e.time || e.timestamp || e.createdAt || e.created_at || "-";
                const actor = e.actor || e.actorName || e.actor_name || "-";
                const branchName = e.branchName || e.branch_name || e.branch || "-";
                const action = e.action || e.description || "-";
                const severity = e.severity || "Info";
                
                return (
                  <tr key={logId} className="border-t hover:bg-slate-50">
                    <td className="p-3 text-brand-muted whitespace-nowrap">{time}</td>
                    <td className="p-3 font-mono text-xs whitespace-nowrap">{actor}</td>
                    <td className="p-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-700">
                        {branchName}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 border border-brand-border">
                        {e.type}
                      </span>
                    </td>
                    <td className="p-3">{action}</td>
                    <td className="p-3">
                      <span className={`text-xs px-3 py-1 rounded-full text-white font-bold ${severityClass(severity)}`}>
                        {severity}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-brand-muted" colSpan={6}>
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
