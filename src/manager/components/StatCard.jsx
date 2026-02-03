const toneToBorder = {
  primary: "border-brand-primary",
  secondary: "border-brand-secondary",
  warning: "border-brand-warning",
  danger: "border-brand-danger",
  success: "border-brand-success",
};

export default function StatCard({ title, value, icon = "📌", tone = "primary" }) {
  const border = toneToBorder[tone] || toneToBorder.primary;
  
  // Safely render value - convert objects to strings
  const safeValue = typeof value === 'object' ? JSON.stringify(value) : value;

  return (
    <div className={`bg-white border border-brand-border border-l-4 ${border} rounded-2xl shadow-sm p-5 h-full min-h-[110px]`}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm text-brand-muted leading-tight">{title}</div>
          <div className="mt-2 text-2xl font-extrabold leading-none">{safeValue}</div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-slate-100 grid place-items-center text-lg shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}
