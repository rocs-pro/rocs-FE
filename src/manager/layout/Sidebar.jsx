import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  CheckCircle,
  Activity,
  ShoppingCart,
  BarChart3,
  BookOpen,
  PenTool,
  TrendingUp,
  Users,
  FileText,
} from "lucide-react";

const base =
  "flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition";
const active = "bg-brand-primary text-white";

const NavItemLink = ({ to, icon: Icon, label, isActive }) => (
  <NavLink to={to} className={({ isActive: active }) => `${base} ${active ? active : ""}`}>
    <Icon size={20} className="shrink-0" />
    <span className="truncate">{label}</span>
  </NavLink>
);

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
        <NavItemLink to="/manager" end icon={LayoutGrid} label="Overview" />

        <div className="pt-3 text-xs uppercase tracking-wider text-slate-400">Operations</div>

        <NavItemLink to="/manager/approvals" icon={CheckCircle} label="Approvals" />
        <NavItemLink to="/manager/branch-activity" icon={Activity} label="Branch Activity Log" />

        <div className="pt-3 text-xs uppercase tracking-wider text-slate-400">Sales</div>

        <NavItemLink to="/manager/sales" icon={ShoppingCart} label="Sales" />
        <NavItemLink to="/manager/sales-reports" icon={BarChart3} label="Sales Reports" />

        <div className="pt-3 text-xs uppercase tracking-wider text-slate-400">Accounting</div>

        <NavItemLink to="/manager/chart-of-accounts" icon={BookOpen} label="Chart of Accounts" />
        <NavItemLink to="/manager/journal-entry" icon={PenTool} label="Journal Entry" />
        <NavItemLink to="/manager/profit-loss" icon={TrendingUp} label="Profit & Loss" />

        <div className="pt-3 text-xs uppercase tracking-wider text-slate-400">Staff</div>

        <NavItemLink to="/manager/staff" icon={Users} label="Staff" />

        <div className="pt-3 text-xs uppercase tracking-wider text-slate-400">Reports</div>

        <NavItemLink to="/manager/reports" icon={FileText} label="Other Reports" />
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
