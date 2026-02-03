import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, Users, Building2, Monitor, Activity, FileText, LogOut } from "lucide-react";

const baseLink = "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-gray-300 hover:bg-gray-800 hover:translate-x-1 hover:text-white";
const activeLink = "bg-brand-primary text-white shadow-lg translate-x-1";

const NavItemLink = ({ to, icon: Icon, label, end = false }) => (
  <NavLink 
    to={to} 
    end={end}
    className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}
  >
    <Icon size={18} className="shrink-0 transition-transform duration-200" />
    <span className="text-sm">{label}</span>
  </NavLink>
);

export default function Sidebar() {
  const navigate = useNavigate();
  
  // Get user info from localStorage
  const userStr = localStorage.getItem('user');
  let userName = 'Admin';
  let userRole = 'Super Admin';
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userName = user.username || user.name || 'Admin';
      userRole = user.role || user.userRole || 'Admin';
    } catch (e) {
      console.error('Error parsing user:', e);
    }
  }
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  return (
    <aside className="w-72 shrink-0 bg-gray-900 text-white flex flex-col overflow-y-auto">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold">
          SmartRetail <span className="text-emerald-400">Pro</span>
        </h1>
        <p className="text-sm text-gray-400 mt-1">Admin Dashboard</p>
      </div>

      <nav className="p-4 flex-1">
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

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-sm leading-4">{userName}</div>
            <div className="text-xs text-gray-400">{userRole}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
