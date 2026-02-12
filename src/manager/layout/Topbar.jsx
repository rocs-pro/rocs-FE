import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, LogOut, Store, LayoutDashboard, AlertTriangle } from "lucide-react";
import { useNotification } from "../../pos/context/NotificationContext";
import { authService } from "../../services/authService";
import { getUserRegistrations } from "../../services/managerService";

// Confirmation Modal Component
function ConfirmModal({ isOpen, onClose, onConfirm, title, message, type = 'info' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">{title}</h3>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-sm transition-all active:scale-95 ${type === 'danger'
              ? 'bg-red-600 hover:bg-red-700 shadow-red-200'
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
              }`}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Topbar() {
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  // Safe destructuring with defaults in case context is missing
  const context = useNotification() || {};
  const { unreadCount = 0, setIsOpen = () => { }, addNotification = () => { } } = context;
  const [lastPendingCount, setLastPendingCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Monitor for new registrations
  useEffect(() => {
    let mounted = true;

    const checkRegistrations = async () => {
      try {
        const data = await getUserRegistrations("PENDING");
        if (!mounted) return;

        const currentCount = Array.isArray(data) ? data.length : 0;

        setLastPendingCount(prev => {
          if (currentCount > prev && prev !== 0) {
            const diff = currentCount - prev;
            if (addNotification) {
              addNotification(
                "info",
                "New Registration Request",
                `${diff} new user(s) waiting for approval`
              );
            }
          }
          return currentCount;
        });
      } catch (err) {
        // Silent fail for polling
      }
    };

    checkRegistrations();
    const interval = setInterval(checkRegistrations, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [addNotification]);

  // User Info
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

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Branch Name Fetch
  useEffect(() => {
    const fetchBranchName = async () => {
      try {
        const branches = await authService.getBranches();
        const branch = branches?.find((b) => String(b.id ?? b.branchId) === String(branchId));
        const backendName = branch?.name || branch?.branchName;
        if (backendName) {
          setBranchLabel(backendName);
        } else if (branchName) {
          setBranchLabel(branchName);
        }
      } catch (error) {
        if (branchName) setBranchLabel(branchName);
      }
    };
    fetchBranchName();
  }, [branchId, branchName]);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Sign Out"
        message="Are you sure you want to sign out of the Manager Dashboard?"
        type="danger"
      />
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 shrink-0 shadow-sm">
        <div className="flex flex-col flex-1">
          <h1 className="font-bold text-lg text-slate-800">Manager Dashboard</h1>
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1">
            <Store className="w-3 h-3" /> {branchLabel || 'Main Branch'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/inventory')}
            className="hidden md:flex group items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-md hover:border-blue-200 border border-transparent"
          >
            <LayoutDashboard size={16} className="text-slate-600 group-hover:text-blue-600 transition-colors" />
            <span className="text-slate-700 group-hover:text-blue-700 transition-colors">Inventory</span>
          </button>

          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600 relative outline-none focus:ring-2 focus:ring-brand/20"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </button>

          <div className="text-right leading-tight hidden sm:block">
            <div className="font-mono text-lg font-bold tracking-wider text-slate-700">
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </div>
            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
              {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>

          {/* User Info */}
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 group cursor-default">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md transform group-hover:scale-105 transition-transform duration-300 ring-2 ring-blue-100">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors max-w-[100px] truncate">
              {userName}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogoutClick}
            className="group relative overflow-hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-red-100 text-slate-700 hover:text-red-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <LogOut size={18} className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-x-0.5" />
            <span className="relative z-10 hidden sm:inline text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </header>
    </>
  );
}
