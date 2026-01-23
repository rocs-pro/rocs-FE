export default function StatCard({ title, value }) {
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
      <div className="text-sm text-brand-muted">{title}</div>
      <div className="mt-2 text-2xl font-extrabold">{value}</div>
    </div>
  );
}
