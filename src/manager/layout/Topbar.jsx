import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, LogOut, Store, LayoutDashboard } from "lucide-react";
import { useNotification } from "../../pos/context/NotificationContext";
import { authService } from "../../services/authService";

export default function Topbar() {
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  const { unreadCount, setIsOpen } = useNotification();

  // Get user info
  const userStr = localStorage.getItem('user');
  let branchName = 'Main Branch';
  let userName = 'User';
  let branchId = 1;
  const [branchLabel, setBranchLabel] = useState("");

  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      branchName = user.branchName || 'Main Branch';
      userName = user.username || user.name || 'User';
      branchId = user.branchId || 1;
    } catch (e) { }
  }

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchBranchName = async () => {
      try {
        const branches = await authService.getBranches();
        const branch = branches?.find((b) => String(b.id ?? b.branchId) === String(branchId));
        const backendName = branch?.name || branch?.branchName;
        if (backendName) {
          setBranchLabel(backendName);
          return;
        }
        if (branchName) {
          setBranchLabel(branchName);
          return;
        }
      } catch (error) {
        if (branchName) {
          setBranchLabel(branchName);
          return;
        }
      }
    };
    fetchBranchName();
  }, [branchId]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 shrink-0 shadow-sm">
      <div className="flex flex-col flex-1">
        <h1 className="font-bold text-lg text-slate-800">Manager Dashboard</h1>
        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
          <Store className="w-3 h-3" /> {branchLabel || branchName || 'Main Branch'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/inventory')}
          className="group flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:border hover:border-blue-200"
        >
          <LayoutDashboard size={16} className="text-slate-600 group-hover:text-blue-600 transition-colors" />
          <span className="hidden sm:inline text-slate-700 group-hover:text-blue-700 transition-colors">Inventory</span>
        </button>

        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600 relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          )}
        </button>

        <div className="text-right leading-tight">
          <div className="font-mono text-lg font-bold tracking-wider text-slate-700">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
            {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
          </div>
        </div>

        {/* User Info */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] transition-all duration-300 group cursor-default">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md transform group-hover:scale-110 transition-transform duration-300 ring-2 ring-blue-100">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">{userName}</span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="group relative overflow-hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-red-100 text-slate-700 hover:text-red-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <LogOut size={18} className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-x-0.5" />
          <span className="relative z-10 hidden sm:inline text-sm font-semibold">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
