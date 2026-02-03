import { NavLink, useNavigate } from "react-router-dom";
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
  UserCheck,
  FileText,
  Package
} from "lucide-react";

const base =
  "flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition";
const activeClass = "bg-blue-600 text-white";

const NavItemLink = ({ to, icon: Icon, label, end = false }) => (
  <NavLink 
    to={to} 
    end={end}
    className={({ isActive }) => `${base} ${isActive ? activeClass : ""}`}
  >
    <Icon size={20} className="shrink-0" />
    <span className="truncate">{label}</span>
  </NavLink>
);

export default function Sidebar() {
  const navigate = useNavigate();
  
  // Get user info from localStorage
  const userStr = localStorage.getItem('user');
  let userName = 'User';
  let userRole = 'Staff';
  let branchName = 'Branch';
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userName = user.username || user.name || 'User';
      userRole = user.role || user.userRole || 'Staff';
      branchName = user.branchName || 'Main Branch';
    } catch (e) {
      console.error('Error parsing user:', e);
    }
  }
  
  const goToInventory = () => navigate('/inventory');

  return (
    <aside className="w-60 shrink-0 bg-slate-900 text-white h-screen flex flex-col min-h-0">
      {/* Header */}
      <div className="p-5 mb-2">
        <div className="text-xl font-extrabold tracking-wide">
          Smart Retail <span className="text-green-500">Pro</span>
        </div>
        <div className="text-xs text-slate-400 mt-1">
          {userRole === 'ADMIN' ? 'Admin Dashboard' : 'Manager Dashboard'}
        </div>
      </div>

      {/* Quick Access Buttons */}
      <div className="px-5 mb-4">
        <button 
          onClick={goToInventory}
          className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition"
        >
          <Package size={16} /> Inventory
        </button>
      </div>

      {/* Scroll Area */}
      <nav className="sidebar-scroll space-y-1 flex-1 min-h-0 overflow-y-auto px-4">
        <NavItemLink to="/manager" end icon={LayoutGrid} label="Overview" />

        <div className="pt-4 pb-1 text-xs uppercase tracking-wider text-slate-500">Operations</div>

        <NavItemLink to="/manager/approvals" icon={CheckCircle} label="Approvals" />
        <NavItemLink to="/manager/branch-activity" icon={Activity} label="Branch Activity" />

        <div className="pt-4 pb-1 text-xs uppercase tracking-wider text-slate-500">Sales</div>

        <NavItemLink to="/manager/sales" icon={ShoppingCart} label="Sales" />
        <NavItemLink to="/manager/sales-reports" icon={BarChart3} label="Sales Reports" />

        <div className="pt-4 pb-1 text-xs uppercase tracking-wider text-slate-500">Accounting</div>

        <NavItemLink to="/manager/chart-of-accounts" icon={BookOpen} label="Chart of Accounts" />
        <NavItemLink to="/manager/journal-entry" icon={PenTool} label="Journal Entry" />
        <NavItemLink to="/manager/profit-loss" icon={TrendingUp} label="Profit & Loss" />

        <div className="pt-4 pb-1 text-xs uppercase tracking-wider text-slate-500">Staff</div>

        <NavItemLink to="/manager/staff" icon={Users} label="Staff" />
        <NavItemLink to="/manager/user-registrations" icon={UserCheck} label="User Registrations" />

        <div className="pt-4 pb-1 text-xs uppercase tracking-wider text-slate-500">Reports</div>

        <NavItemLink to="/manager/reports" icon={FileText} label="Other Reports" />
      </nav>

    </aside>
  );
}
