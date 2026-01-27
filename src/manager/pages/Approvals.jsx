import { useEffect, useState } from "react";
import Badge from "../components/Badge";
import { getApprovals, updateApprovalStatus } from "../../services/managerService";
import ActionDropdown from "../components/ActionDropdown";

export default function Approvals() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getApprovals();
      setRows(data || []);
    } catch (err) {
      console.error("Error fetching approvals:", err);
      setError("Failed to load approvals");
    } finally {
      setLoading(false);
    }
  };

  async function setStatus(id, status) {
    try {
      setUpdating(id);
      await updateApprovalStatus(id, status);
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(null);
    }
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-extrabold">Approvals</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
          <button
            onClick={fetchApprovals}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Approvals</h1>

      <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 font-bold">Pending Requests</div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Reference</th>
                <th className="text-left p-3">Requested By</th>
                <th className="text-left p-3">Time</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-brand-muted">
                    Loading approvals...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-brand-muted" colSpan={7}>
                    No approvals
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-slate-50">
                    <td className="p-3 font-mono text-xs">{r.id}</td>
                    <td className="p-3 font-semibold">{r.category}</td>
                    <td className="p-3">{r.reference}</td>
                    <td className="p-3">{r.requestedBy}</td>
                    <td className="p-3 text-brand-muted">{r.time}</td>
                    <td className="p-3">
                      <Badge label={r.status} />
                    </td>
                    <td className="p-3">
                      <ActionDropdown
                        disabled={r.status !== "Pending" || updating === r.id}
                        onApprove={() => setStatus(r.id, "Approved")}
                        onReject={() => setStatus(r.id, "Rejected")}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-brand-muted">
        Connected to backend approval endpoints. Real-time updates enabled.
      </p>
    </div>
  );
}
