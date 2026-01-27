import { useEffect, useState } from "react";
import { getBranchActivityLog } from "../../services/managerService";
import Badge from "../components/Badge";

export default function BranchActivityLog() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBranchActivityLog(20);
        setActivities(data || []);
      } catch (err) {
        console.error("Error fetching activity log:", err);
        setError("Failed to load activity log");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Branch Activity Log</h1>

      <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 font-bold">Branch Audit Trail</div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3">Time</th>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Action</th>
                <th className="text-left p-3">Details</th>
                <th className="text-left p-3">Severity</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-brand-muted">
                    Loading activity log...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-brand-muted" colSpan={5}>
                    No activity
                  </td>
                </tr>
              ) : (
                activities.map((e, i) => (
                  <tr key={i} className="border-t hover:bg-slate-50">
                    <td className="p-3 text-brand-muted">{e.time}</td>
                    <td className="p-3 font-semibold">{e.user}</td>
                    <td className="p-3">{e.action}</td>
                    <td className="p-3">{e.details}</td>
                    <td className="p-3"><Badge label={e.severity} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
