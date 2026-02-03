import { useNavigate } from "react-router-dom";
import Clock from "../../shared/Clock";
import { useState, useEffect } from "react";
import { LogOut, LayoutDashboard } from "lucide-react";

export default function Topbar() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  
  // Get user info from localStorage
  const userStr = localStorage.getItem('user');
  let userName = 'Admin';
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userName = user.username || user.name || 'Admin';
    } catch (e) {}
  }
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 gap-4 shrink-0 shadow-sm">
      <div className="flex flex-col">
        <h1 className="font-bold text-lg text-slate-800">Admin Dashboard</h1>
        <span className="text-xs text-slate-500">System Administration</span>
      </div>

      {/* Quick Nav Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/inventory')}
          className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition"
        >
          <LayoutDashboard size={16} className="text-slate-600" />
          <span className="hidden sm:inline text-slate-700">Inventory</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <div className="font-mono text-lg font-bold tracking-wider text-slate-700">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
            {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
          </div>
        </div>

        {/* User Info */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-blue-700">{userName}</span>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors font-medium"
          onClick={handleLogout}
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
