import { useMemo, useState } from "react";
import { salesReports } from "../data/managerMockData";

export default function SalesReports() {
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return salesReports.filter((r) => {
      const okFrom = from ? r.date >= from : true;
      const okTo = to ? r.date <= to : true;
      const okQ = s ? r.date.toLowerCase().includes(s) : true;
      return okFrom && okTo && okQ;
    });
  }, [q, from, to]);

  function exportCSV() {
    const header = ["Date","Invoices","Revenue","Profit"].join(",");
    const lines = filtered.map((r) => [r.date, r.invoices, r.revenue, r.profit].join(","));
    const csv = [header, ...lines].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${from || "all"}-${to || "all"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totals = filtered.reduce(
    (acc, r) => ({
      invoices: acc.invoices + r.invoices,
      revenue: acc.revenue + r.revenue,
      profit: acc.profit + r.profit,
    }),
    { invoices: 0, revenue: 0, profit: 0 }
  );

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Sales Reports</h1>

      <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="font-bold">Daily Sales Summary</div>
            <button
              type="button"
              onClick={exportCSV}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-100 border border-brand-border hover:bg-slate-200 transition text-sm font-bold"
            >
              Export CSV
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Quick filter (YYYY-MM-DD)"
              className="w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
            />
            <div>
              <div className="text-xs text-brand-muted mb-1">From</div>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-brand-border bg-white"
              />
            </div>
            <div>
              <div className="text-xs text-brand-muted mb-1">To</div>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-brand-border bg-white"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3">Date</th>
                <th className="text-right p-3">Invoices</th>
                <th className="text-right p-3">Revenue (LKR)</th>
                <th className="text-right p-3">Profit (LKR)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.date} className="border-t hover:bg-slate-50">
                  <td className="p-3 font-mono text-xs">{r.date}</td>
                  <td className="p-3 text-right">{r.invoices}</td>
                  <td className="p-3 text-right font-bold">{r.revenue.toLocaleString()}</td>
                  <td className="p-3 text-right">{r.profit.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="border-t bg-slate-50">
                <td className="p-3 font-bold">TOTAL</td>
                <td className="p-3 text-right font-bold">{totals.invoices}</td>
                <td className="p-3 text-right font-extrabold">{totals.revenue.toLocaleString()}</td>
                <td className="p-3 text-right font-bold">{totals.profit.toLocaleString()}</td>
              </tr>

              {filtered.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-brand-muted" colSpan={4}>
                    No records
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
