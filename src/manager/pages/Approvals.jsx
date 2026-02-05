import { useEffect, useState } from "react";
import Badge from "../components/Badge";
import { getApprovals, updateApprovalStatus } from "../../services/managerService";
import { CheckCircle, ArrowUpRight, ArrowDownLeft, ShieldCheck, ListFilter, History } from 'lucide-react';

const formatCategory = (cat) => {
  if (!cat) return "";
  return cat
    .replace("CASH_FLOW_", "")
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
};

const getCategoryIcon = (cat) => {
  const lower = (cat || "").toLowerCase();
  if (lower.includes("paid_in")) return <ArrowDownLeft className="w-4 h-4 text-emerald-500" />;
  if (lower.includes("paid_out")) return <ArrowUpRight className="w-4 h-4 text-red-500" />;
  if (lower.includes("registration")) return <ShieldCheck className="w-4 h-4 text-blue-500" />;
  return <ListFilter className="w-4 h-4 text-slate-400" />;
};

export default function Approvals() {
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
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
      const allRows = (data || []).filter(item => item.category !== "USER_REGISTRATION");

      setPending(allRows.filter(r => r.status === 'Pending'));
      setHistory(allRows.filter(r => r.status !== 'Pending'));

    } catch (err) {
      console.error("Error fetching approvals:", err);
      setError("Failed to load approvals");
    } finally {
      setLoading(false);
    }
  };

  async function handleStatus(id, status) {
    try {
      setUpdating(id);
      await updateApprovalStatus(id, status);

      // Move from pending to history locally to update UI instantly
      const item = pending.find(r => r.id === id);
      if (item) {
        const updatedItem = { ...item, status: status, time: "Just now" }; // Or keep original time
        setPending(prev => prev.filter(r => r.id !== id));
        setHistory(prev => [updatedItem, ...prev]);
      }

      // Optionally refetch to be sure
      // fetchApprovals(); 
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
        <h1 className="text-xl font-extrabold text-slate-800">Approvals & Requests</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchApprovals}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-slate-800">Approvals & Requests</h1>
        <button
          onClick={fetchApprovals}
          className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded font-bold transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* PENDING TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <span className="font-bold text-slate-700">Pending Approvals</span>
          {pending.length > 0 && (
            <span className="bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm border border-amber-200">
              {pending.length} Waiting
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Type</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Reference</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Amount</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Requested By</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Time</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                      <span>Checking...</span>
                    </div>
                  </td>
                </tr>
              ) : pending.length === 0 ? (
                <tr>
                  <td className="p-8 text-center text-slate-400" colSpan={6}>
                    <div className="flex flex-col items-center gap-1">
                      <CheckCircle className="w-5 h-5 text-emerald-200" />
                      <span>No pending approvals found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                pending.map((r) => {
                  const isProcessing = updating === r.id;

                  // Parse Amount attempt
                  let displayAmount = "-";
                  if (r.description) {
                    const match = r.description.match(/: (\d+(\.\d{1,2})?)/);
                    if (match) {
                      displayAmount = "LKR " + match[1];
                    }
                  }

                  return (
                    <tr key={r.id} className={`group hover:bg-slate-50 transition-colors ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-2 font-semibold text-slate-700">
                          {getCategoryIcon(r.category)}
                          {formatCategory(r.category)}
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-600">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {r.reference}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-700 text-xs">
                        {displayAmount}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-700">{r.requestedBy}</div>
                        <div className="text-[10px] text-slate-400">{r.email || "No Email"}</div>
                      </td>
                      <td className="p-4 text-slate-500 text-xs">{r.time}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStatus(r.id, "Approved")}
                            disabled={isProcessing}
                            className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 shadow-sm hover:shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatus(r.id, "Rejected")}
                            disabled={isProcessing}
                            className="px-3 py-1.5 bg-white border border-slate-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 hover:border-red-200 transition-all active:scale-95 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* HISTORY TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 font-bold text-slate-700 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-400" /> Approval History
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Type</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Reference</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Amount</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Requested By</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Requested Time</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Approved Time</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Loading history...</td>
                </tr>
              ) : history.length === 0 ? (
                <tr>
                  <td className="p-8 text-center text-slate-400" colSpan={7}>No approval history</td>
                </tr>
              ) : (
                history.map((r) => {
                  let displayAmount = "-";
                  if (r.description) {
                    const match = r.description.match(/: (\d+(\.\d{1,2})?)/);
                    if (match) displayAmount = "LKR " + match[1];
                  }
                  return (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-600">
                        {formatCategory(r.category)}
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-500">
                        {r.reference}
                      </td>
                      <td className="p-4 font-bold text-slate-700 text-xs">
                        {displayAmount}
                      </td>
                      <td className="p-4 text-slate-600">
                        {r.requestedBy}
                      </td>
                      <td className="p-4 text-slate-500 text-xs">
                        {r.time}
                      </td>
                      <td className="p-4 text-slate-500 text-xs font-mono">
                        {r.approvedAt || "-"}
                      </td>
                      <td className="p-4">
                        <Badge label={r.status} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
