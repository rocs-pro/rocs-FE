import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, Users, Building2, Monitor, Activity, FileText, LogOut } from "lucide-react";

const baseLink = "flex items-center gap-3 px-3 py-2 rounded-lg text-brand-muted hover:bg-brand-hover hover:text-white transition";
const activeLink = "bg-brand-primary text-white";

const NavItemLink = ({ to, icon: Icon, label, end = false }) => (
  <NavLink 
    to={to} 
    end={end}
    className={({ isActive }) => `${baseLink} ${isActive ? activeLink : ""}`}
  >
    <Icon size={20} className="shrink-0" />
    <span className="truncate">{label}</span>
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
    <aside className="w-60 shrink-0 bg-brand-deep text-white p-5 flex flex-col">
      <div className="mb-6">
        <div className="text-xl font-extrabold tracking-wide">
          Smart Retail <span className="text-pos-success">Pro</span>
        </div>
        <div className="text-xs text-slate-300">Admin Dashboard</div>
      </div>

      <nav className="space-y-2 flex-1 overflow-y-auto">
        <NavItemLink to="/admin" end icon={LayoutGrid} label="Overview" />

        <div className="pt-4 pb-1 text-xs uppercase tracking-wider text-slate-500">Administration</div>

        <NavItemLink to="/admin/users" icon={Users} label="User Registration" />
        <NavItemLink to="/admin/branches" icon={Building2} label="Branch Management" />
        <NavItemLink to="/admin/terminals" icon={Monitor} label="Terminals" />

        <div className="pt-4 pb-1 text-xs uppercase tracking-wider text-slate-500">Audit & Logs</div>

        <NavItemLink to="/admin/system-activity" icon={Activity} label="System Activity" />

        <div className="pt-4 pb-1 text-xs uppercase tracking-wider text-slate-500">Reports</div>

        <NavItemLink to="/admin/reports" icon={FileText} label="Reports" />
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-primary grid place-items-center font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold leading-4">{userName}</div>
            <div className="text-xs text-slate-300">{userRole}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
