import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, LogOut, Store } from "lucide-react";
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
    } catch (e) {}
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
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
      <div className="h-16 px-6 flex items-center justify-between gap-4">
        {/* Left - Title & Branch */}
        <div className="flex items-center gap-6 min-w-0">
          <div className="flex flex-col leading-none min-w-0">
            <span className="font-bold text-xl text-slate-900 tracking-tight truncate">Manager Dashboard</span>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
              <Store className="w-3 h-3" /> {branchLabel || branchName || 'Main Branch'}
            </span>
          </div>
        </div>

        {/* Right - Notifications, Profile, Date/Time, Logout */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-full py-1.5 px-4">
            <User className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold tracking-wide uppercase text-blue-700">{userName}</span>
          </div>

          <div className="text-right leading-tight hidden md:block">
            <div className="font-mono text-2xl font-bold text-slate-800 tracking-widest">
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md text-xs font-bold uppercase tracking-widest border border-red-800 shadow-lg active:scale-95 transition-all w-auto"
          >
            LOGOUT <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
