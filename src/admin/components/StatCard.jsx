export default function StatCard({ title, value, abnormal, icon, big, colorful }) {
  const sizeClass = big ? "p-8 min-h-[140px]" : "p-5";
  const valueClass = big ? "text-5xl" : "text-2xl";
  const colorClass = colorful
    ? abnormal
      ? "bg-gradient-to-br from-red-400 via-red-200 to-red-100 border-red-500"
      : "bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-soft border-brand-primary"
    : abnormal
    ? "border-red-500"
    : "";
  return (
    <div className={`rounded-2xl shadow-lg border ${sizeClass} ${colorClass}`}>
      <div className={`text-lg flex items-center gap-3 font-bold ${abnormal ? "text-red-700" : "text-black"}`}>{icon} {title}</div>
      <div className={`mt-4 font-extrabold text-black ${valueClass}`}>{value}</div>
    </div>
  );
}
