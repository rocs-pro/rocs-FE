import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { LayoutGrid, Users, Building2, Monitor, Activity, FileText, KeyRound } from "lucide-react";
import { getPasswordResetPendingCount } from "../services/adminApi";

const baseLink = "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-gray-300 hover:bg-gray-800 hover:translate-x-1 hover:text-white";
const activeLink = "bg-brand-primary text-white shadow-lg translate-x-1";

const NavItemLink = ({ to, icon: Icon, label, end = false, badge = null }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}
  >
    <Icon size={18} className="shrink-0 transition-transform duration-200" />
    <span className="text-sm flex-1">{label}</span>
    {badge !== null && badge > 0 && (
      <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-amber-500 text-white text-xs font-bold rounded-full animate-pulse shadow-sm">
        {badge}
      </span>
    )}
  </NavLink>
);

export default function Sidebar() {
  const [pendingResetCount, setPendingResetCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const data = await getPasswordResetPendingCount();
        setPendingResetCount(data.pendingCount || 0);
      } catch (e) {
        // silent
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-72 shrink-0 bg-gray-900 text-white h-screen flex flex-col min-h-0">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">
          SmartRetail <span className="text-emerald-400">Pro</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">Admin Dashboard</p>
      </div>

      <nav className="sidebar-scroll p-4 flex-1 min-h-0 overflow-y-auto">
        <div className="mb-6">
          <div className="flex items-center px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            Overview
          </div>
          <div className="mt-2 space-y-1">
            <NavItemLink to="/admin" end icon={LayoutGrid} label="Overview" />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            Administration
          </div>
          <div className="mt-2 space-y-1">
            <NavItemLink to="/admin/users" icon={Users} label="User Registration" />
            <NavItemLink to="/admin/branches" icon={Building2} label="Branch Management" />
            <NavItemLink to="/admin/terminals" icon={Monitor} label="Terminals" />
            <NavItemLink to="/admin/password-requests" icon={KeyRound} label="Password Requests" badge={pendingResetCount} />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            Audit & Logs
          </div>
          <div className="mt-2 space-y-1">
            <NavItemLink to="/admin/system-activity" icon={Activity} label="System Activity" />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            Reports
          </div>
          <div className="mt-2 space-y-1">
            <NavItemLink to="/admin/reports" icon={FileText} label="Reports" />
          </div>
        </div>
      </nav>
    </aside>
  );
}
