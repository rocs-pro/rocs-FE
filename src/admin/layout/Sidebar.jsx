import { NavLink } from "react-router-dom";

const base =
  "block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition";
const active = "bg-brand-primary text-white";

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 bg-brand-sidebar text-white p-5 flex flex-col">
      <div className="mb-6">
        <div className="text-xl font-extrabold tracking-wide">Smart Retail Pro</div>
        <div className="text-xs text-slate-300">Admin Dashboard</div>
      </div>

      <nav className="space-y-2">
        <NavLink to="/admin" end className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
          Overview
        </NavLink>

        <div className="pt-3 text-xs uppercase tracking-wider text-slate-400">Administration</div>

        <NavLink to="/admin/users" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
          User Registration
        </NavLink>
        <NavLink to="/admin/password-reset" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
          Password Reset
        </NavLink>
        <NavLink to="/admin/branches" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
          Branch Management
        </NavLink>

        <div className="pt-3 text-xs uppercase tracking-wider text-slate-400">Audit & Logs</div>

        <NavLink to="/admin/system-activity" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
          System Activity
        </NavLink>

        <div className="pt-3 text-xs uppercase tracking-wider text-slate-400">Reports</div>

        <NavLink to="/admin/reports" className={({ isActive }) => `${base} ${isActive ? active : ""}`}>
          Reports
        </NavLink>
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-brand-secondary grid place-items-center font-bold">
            A
          </div>
          <div>
            <div className="font-bold leading-4">Admin</div>
            <div className="text-xs text-slate-300">Super Admin</div>
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
