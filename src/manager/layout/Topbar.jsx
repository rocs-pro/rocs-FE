import { useState } from "react";
import Clock from "../../shared/Clock";
import ShiftModal from "../components/ShiftModal";
import QuickActionsModal from "../components/QuickActionsModal";

export default function Topbar() {
  const [query, setQuery] = useState("");
  const [shiftOpen, setShiftOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);

  const branch = "Colombo Main";
  const now = new Date();

  return (
    <>
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-brand-border">
        <div className="h-14 px-5 flex items-center justify-between gap-4">
          {/* Left */}
          <div className="min-w-0">
            <div className="font-extrabold leading-4">Manager Dashboard</div>
            <div className="text-xs text-brand-muted truncate">
              {branch} • {now.toDateString()}
            </div>
          </div>

          {/* Middle: Search (desktop only) */}
          <div className="flex-1 hidden md:flex justify-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search invoice / product / customer..."
              className="w-full max-w-xl px-4 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
            />
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <Clock />

            <span className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 border border-brand-border text-sm font-semibold">
              🏢 {branch}
            </span>

            <button
              type="button"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 border border-brand-border hover:bg-slate-200 transition text-sm font-semibold"
              onClick={() => setShiftOpen(true)}
            >
              🕒 Shift
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white transition text-sm font-semibold"
              onClick={() => setQuickOpen(true)}
            >
              ➕ Quick
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="px-5 pb-3 md:hidden">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search invoice / product / customer..."
            className="w-full px-4 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
          />
        </div>
      </header>

      {/* Modals */}
      <ShiftModal open={shiftOpen} onClose={() => setShiftOpen(false)} branch={branch} />
      <QuickActionsModal open={quickOpen} onClose={() => setQuickOpen(false)} />
    </>
  );
}
