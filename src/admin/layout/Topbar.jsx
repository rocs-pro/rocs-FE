import { useNavigate } from "react-router-dom";
import Clock from "../../shared/Clock";
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";

export default function Topbar() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  
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
    <header className="h-14 bg-white border-b border-brand-border flex items-center justify-between px-5">
      <div>
        <div className="font-extrabold leading-4">Admin Dashboard</div>
        <div className="text-xs text-brand-muted">System Administration</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <div className="font-mono text-lg font-bold tracking-wider">
            {time.toLocaleTimeString('en-US', { hour12: false })}
          </div>
          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
            {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()}
          </div>
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
