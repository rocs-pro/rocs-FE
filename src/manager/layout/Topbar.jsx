import { useState, useEffect } from "react";
import { Bell, Search, Calendar, Clock as ClockIcon } from "lucide-react";

export default function Topbar() {
  const [query, setQuery] = useState("");
  const [time, setTime] = useState(new Date());
  
  // Get user info
  const userStr = localStorage.getItem('user');
  let branchName = 'Main Branch';
  
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      branchName = user.branchName || 'Main Branch';
    } catch (e) {}
  }

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
      <div className="h-16 px-6 flex items-center justify-between gap-4">
        {/* Left - Page Title */}
        <div className="min-w-0">
          <div className="font-bold text-lg text-slate-800">Control Dashboard</div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Calendar size={12} />
            {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Middle: Search (desktop only) */}
        <div className="flex-1 hidden md:flex justify-center max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search invoice, product, or customer..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Right - Clock & Branch */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-slate-100 transition">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* Clock */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 border border-slate-200">
            <ClockIcon size={16} className="text-slate-500" />
            <span className="font-mono font-bold text-slate-700">
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </span>
          </div>

          {/* Branch Badge */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-lg">🏢</span>
            <span className="text-sm font-semibold text-blue-700">{branchName}</span>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="px-6 pb-3 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </header>
  );
}
