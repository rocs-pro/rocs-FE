import { useEffect, useMemo, useState } from "react";
import { salesTarget } from "../data/managerMockData";
import SetTargetModal from "./SetTargetModal";

// Persist per-day target per-branch (no backend yet)
const BRANCH = "Colombo Main";

export default function TargetProgress() {
  const { targetToday: defaultTarget, achievedToday } = salesTarget;
  const dayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const storageKey = `srp_target_${BRANCH.replace(/\s+/g, "_")}_${dayKey}`;

  const [targetToday, setTargetToday] = useState(defaultTarget);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const n = Number(saved);
      if (Number.isFinite(n) && n > 0) setTargetToday(n);
    }
  }, [storageKey]);

  const pct = useMemo(() => {
    if (!targetToday) return 0;
    return Math.min(100, Math.round((achievedToday / targetToday) * 100));
  }, [achievedToday, targetToday]);

  const achieved = achievedToday.toLocaleString();
  const target = targetToday.toLocaleString();

  const saveTarget = (n) => {
    setTargetToday(n);
    localStorage.setItem(storageKey, String(n));
  };

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-brand-muted">Today's Target</div>
          <div className="mt-1 text-xl font-extrabold">LKR {achieved} / {target}</div>
          <div className="mt-1 text-xs text-brand-muted">You're at <span className="font-bold text-brand-primary">{pct}%</span> of today's sales goal.</div>
        </div>

        <button
          type="button"
          className="text-xs px-3 py-1 rounded-full bg-slate-100 border border-brand-border font-bold hover:bg-slate-200 transition"
          onClick={() => setOpen(true)}
        >
          🎯 Set Target
        </button>
      </div>

      <div className="mt-4 h-3 w-full rounded-full bg-slate-100 overflow-hidden border border-brand-border">
        <div
          className="h-full bg-brand-primary"
          style={{ width: `${pct}%` }}
        />
      </div>

      <SetTargetModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={saveTarget}
        initialTarget={targetToday}
      />
    </div>
  );
}
