const classes = {
  Success: "bg-brand-success",
  Active: "bg-brand-success",
  Available: "bg-brand-success",
  Warning: "bg-brand-warning",
  Critical: "bg-brand-danger",
  Failed: "bg-brand-danger",
  Blocked: "bg-brand-danger",
  Offline: "bg-slate-500",
  Sold: "bg-brand-secondary",
};

export default function Badge({ label }) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border";

  const styles = {
    // approvals
    Approved: "bg-green-50 text-green-700 border-green-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Rejected: "bg-red-50 text-red-700 border-red-200",
    Success: "bg-green-50 text-green-700 border-green-200",
    Critical: "bg-orange-50 text-orange-700 border-orange-200",
    Info: "bg-blue-50 text-blue-700 border-blue-200",

    // staff statuses
    Active: "bg-green-50 text-green-700 border-green-200",
    Online: "bg-green-50 text-green-700 border-green-200",
    Offline: "bg-red-50 text-red-700 border-red-200",
    Inactive: "bg-red-50 text-red-700 border-red-200",
    Warning: "bg-red-50 text-red-700 border-red-200",
  };

  return <span className={`${base} ${styles[label] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}>{label}</span>;
}
