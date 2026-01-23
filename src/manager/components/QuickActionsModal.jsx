import { useNavigate } from "react-router-dom";

export default function QuickActionsModal({ open, onClose }) {
  const navigate = useNavigate();
  if (!open) return null;

  const go = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-brand-border shadow-xl p-5">
        <div className="flex items-center justify-between">
          <div className="font-extrabold text-lg">Quick Actions</div>
          <button
            type="button"
            className="px-3 py-1 rounded-lg bg-slate-100 border border-brand-border hover:bg-slate-200"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <button
            className="w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold"
            onClick={() => go("/manager/approvals")}
          >
            ✅ Create Approval Request
          </button>

          <button
            className="w-full py-3 rounded-xl bg-slate-100 border border-brand-border hover:bg-slate-200 font-bold"
            onClick={() => go("/manager/journal-entry")}
          >
            🧾 New Journal Entry
          </button>

          <button
            className="w-full py-3 rounded-xl bg-slate-100 border border-brand-border hover:bg-slate-200 font-bold"
            onClick={() => go("/manager/sales-reports")}
          >
            📊 Sales Reports
          </button>

          <button
            className="w-full py-3 rounded-xl bg-slate-100 border border-brand-border hover:bg-slate-200 font-bold"
            onClick={() => go("/manager")}
          >
            🎯 Set Target (on Overview)
          </button>
        </div>
      </div>
    </div>
  );
}
