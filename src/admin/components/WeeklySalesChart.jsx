// Kept for reference. You already use Recharts via ChartBox.
// This component is a simple fallback visual.

export default function WeeklySalesChart({ data }) {
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
      <div className="font-bold mb-3">Weekly Sales (simple)</div>
      <div className="flex items-end gap-2 h-40">
        {data.map((v, i) => (
          <div key={i} className="flex-1 bg-brand-secondary/30 rounded-md" style={{ height: `${Math.max(10, v / 4)}px` }} title={String(v)} />
        ))}
      </div>
      <div className="mt-2 text-xs text-brand-muted">Tip: use the Recharts chart for production.</div>
    </div>
  );
}
