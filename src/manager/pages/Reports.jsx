export default function Reports() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Reports</h1>
      <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
        <div className="font-bold mb-1">Branch Reports</div>
        <p className="text-sm text-brand-muted">
          Typical manager reports: Daily Sales Summary, Stock Valuation, Top Products, and GRN Summary.
          Later you can connect these to your Spring Boot APIs.
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <button type="button" className="py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold transition">
            Download Daily Sales (PDF)
          </button>
          <button type="button" className="py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold transition">
            Export Stock (Excel)
          </button>
          <button type="button" className="py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold transition">
            View Top Products
          </button>
        </div>
      </div>
    </div>
  );
}
