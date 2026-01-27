import { NavLink } from "react-router-dom";

const base =
  "block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition";
const active = "bg-brand-primary text-white";

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-brand-sidebar text-white h-screen flex flex-col min-h-0">
      {/* Header */}
      <div className="p-5 mb-2">
        <div className="text-xl font-extrabold tracking-wide">
          Smart Retail <span className="text-green-500">Pro</span>
        </div>
        <div className="text-xs text-slate-300">
          Manager Dashboard • Colombo Main
        </div>
      </div>

      {/* Scroll Area */}
      <nav className="sidebar-scroll space-y-2 flex-1 min-h-0 overflow-y-auto px-5">
        <NavLink to="/manager" end className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
          Overview
        </NavLink>

        <div className="pt-3 text-xs uppercase tracking-wider text-slate-400">Operations</div>

        <NavLink to="/manager/approvals" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
          Approvals
        </NavLink>
        <NavLink to="/manager/branch-activity" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
          Branch Activity Log
        </NavLink>

        <div className="pt-3 text-xs uppercase tracking-wider text-slate-400">Sales</div>

        <NavLink to="/manager/sales" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
          Sales
        </NavLink>
        <NavLink to="/manager/sales-reports" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
          Sales Reports
        </NavLink>

        <div className="pt-3 text-xs uppercase tracking-wider text-slate-400">Accounting</div>

        <NavLink to="/manager/chart-of-accounts" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
          Chart of Accounts
        </NavLink>
        <NavLink to="/manager/journal-entry" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
          Journal Entry
        </NavLink>
        <NavLink to="/manager/profit-loss" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
          Profit & Loss
        </NavLink>

        <div className="pt-3 text-xs uppercase tracking-wider text-slate-400">Staff</div>

        <NavLink to="/manager/staff" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
          Staff
        </NavLink>

        <div className="pt-3 text-xs uppercase tracking-wider text-slate-400">Reports</div>

        <NavLink to="/manager/reports" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
          Other Reports
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="p-5 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-brand-secondary grid place-items-center font-bold">
            M
          </div>
          <div className="min-w-0">
            <div className="font-bold leading-4 truncate">Branch Manager</div>
            <div className="text-xs text-slate-300 truncate">Colombo Main</div>
          </div>
        </div>

        <button
          type="button"
          className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
          onClick={() => alert("Hook this to your logout later")}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
