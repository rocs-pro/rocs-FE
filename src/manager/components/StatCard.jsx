const toneToBorder = {
  primary: "border-brand-primary",
  secondary: "border-brand-secondary",
  warning: "border-brand-warning",
  danger: "border-brand-danger",
  success: "border-brand-success",
};

export default function StatCard({ title, value, icon = "📌", tone = "primary" }) {
  const border = toneToBorder[tone] || toneToBorder.primary;

  return (
    <div className={`bg-white border border-brand-border border-l-4 ${border} rounded-2xl shadow-sm p-5`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm text-brand-muted">{title}</div>
          <div className="mt-2 text-2xl font-extrabold">{value}</div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-slate-100 grid place-items-center text-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}
