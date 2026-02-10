import { useEffect, useState } from "react";
import Badge from "../components/Badge";
import { getApprovals, updateApprovalStatus, getApprovalHistoryPdf } from "../../services/managerService";
import { CheckCircle, ArrowUpRight, ArrowDownLeft, ShieldCheck, ListFilter, History, Download, AlertTriangle, X } from 'lucide-react';

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

// Confirmation Modal Component
function ConfirmModal({ isOpen, onClose, onConfirm, title, message, type = 'info' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">{title}</h3>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-sm transition-all active:scale-95 ${type === 'danger'
              ? 'bg-red-600 hover:bg-red-700 shadow-red-200'
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
              }`}
          >
            Confirm Action
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Approvals() {
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    id: null,
    status: null,
    title: "",
    message: "",
    type: "info"
  });

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

  const openConfirmModal = (id, status) => {
    const isApprove = status === 'Approved';
    setModalConfig({
      isOpen: true,
      id,
      status,
      title: isApprove ? "Confirm Approval" : "Reject Request",
      message: isApprove
        ? "Are you sure you want to approve this request? This action will update the system records immediately."
        : "Are you sure you want to reject this request? The requester will be notified.",
      type: isApprove ? "info" : "danger"
    });
  };

  const closeConfirmModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  async function handleStatusConfirm() {
    const { id, status } = modalConfig;
    if (!id || !status) return;

    closeConfirmModal();

    try {
      setUpdating(id);
      await updateApprovalStatus(id, status);

      // Move from pending to history locally to update UI instantly
      const item = pending.find(r => r.id === id);
      if (item) {
        const updatedItem = { ...item, status: status, approvedAt: new Date().toLocaleString() };
        setPending(prev => prev.filter(r => r.id !== id));
        setHistory(prev => [updatedItem, ...prev]);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setUpdating(null);
    }
  }

  const exportHistoryPDF = async () => {
    try {
      setExporting(true);
      const blob = await getApprovalHistoryPdf();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `approval_history_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export PDF', err);
      alert("Failed to generate PDF report.");
    } finally {
      setExporting(false);
    }
  };

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
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={closeConfirmModal}
        onConfirm={handleStatusConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Approvals & Requests</h1>
          <p className="text-slate-500 text-sm mt-1">Manage pending requests and view history</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchApprovals}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* PENDING TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <span className="font-bold text-slate-700">Pending Approvals</span>
          {pending.length > 0 && (
            <span className="bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm border border-amber-200">
              {pending.length} Waiting
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider w-12"></th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Type / Ref</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Reason</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Amount</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Requested By</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                      <span>Checking for requests...</span>
                    </div>
                  </td>
                </tr>
              ) : pending.length === 0 ? (
                <tr>
                  <td className="p-12 text-center text-slate-400" colSpan={6}>
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle className="w-8 h-8 text-emerald-100 text-emerald-400" />
                      <span>No pending approvals found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                pending.map((r) => {
                  const isProcessing = updating === r.id;

                  // Determine display values
                  const displayAmount = r.amount ? `LKR ${Number(r.amount).toLocaleString()}` : "-";
                  const displayReason = r.reason || r.description || "No reason provided";
                  const displayRef = r.reference || r.referenceNo || "-";

                  return (
                    <tr key={r.id} className={`group hover:bg-blue-50/30 transition-colors ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                      <td className="p-4 pl-6">
                        <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                          {getCategoryIcon(r.category)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-700">{formatCategory(r.category)}</div>
                        <div className="font-mono text-xs text-slate-500 mt-1">
                          {displayRef}
                        </div>
                      </td>
                      <td className="p-4 max-w-xs">
                        <div className="text-slate-600 text-sm leading-snug">
                          {displayReason}
                        </div>
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <History className="w-3 h-3" /> {r.time}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-800">
                        {displayAmount}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                            {r.requestedBy?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-700">{r.requestedBy}</div>
                            <div className="text-[10px] text-slate-400">{r.email || "Staff"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openConfirmModal(r.id, "Approved")}
                            disabled={isProcessing}
                            className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 shadow-sm hover:shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openConfirmModal(r.id, "Rejected")}
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
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="font-bold text-slate-700 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" /> Approval History
          </div>
          <button
            onClick={exportHistoryPDF}
            disabled={exporting}
            className={`flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors ${exporting ? 'opacity-50 cursor-wait' : ''}`}
          >
            {exporting ? (
              <>Generating...</>
            ) : (
              <>
                <Download className="w-3 h-3" /> Export PDF
              </>
            )}
          </button>
        </div>
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0">
              <tr>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Type</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Reference</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Reason / Description</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Amount</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Requested By</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Approved At</th>
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
                  const displayAmount = r.amount ? `LKR ${Number(r.amount).toLocaleString()}` : "-";
                  const displayReason = r.reason || r.description || "-";
                  const displayRef = r.reference || r.referenceNo || "-"; // r.reference is typically REF-ID if refNo missing

                  return (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-600">
                        {formatCategory(r.category)}
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-500">
                        {displayRef}
                      </td>
                      <td className="p-4 text-slate-600 text-xs max-w-xs truncate">
                        {displayReason}
                      </td>
                      <td className="p-4 font-bold text-slate-700 text-xs">
                        {displayAmount}
                      </td>
                      <td className="p-4 text-slate-600">
                        {r.requestedBy}
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
