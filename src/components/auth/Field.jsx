function Field({ label, icon, children }) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/30">
        <span className="text-slate-400">{icon}</span>
        {children}
      </div>
    </div>
  );
}

export default Field;