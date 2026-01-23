import Clock from "../../shared/Clock";
export default function Topbar() {
  return (
    <header className="h-14 bg-white border-b border-brand-border flex items-center justify-between px-5">
      <div>
        <div className="font-extrabold leading-4">Admin Dashboard</div>
        <div className="text-xs text-brand-muted">System Administration</div>
      </div>

      <div className="flex items-center gap-3">
        <Clock />
        <span className="text-xs px-3 py-1 rounded-full bg-slate-100 border border-brand-border">
          {new Date().toDateString()}
        </span>
        <button
          type="button"
          className="text-xs px-3 py-1 rounded-full bg-brand-primary text-white hover:bg-brand-secondary transition"
          onClick={() => alert("Hook this to your logout later")}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
