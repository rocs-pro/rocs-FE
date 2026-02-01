import { useEffect, useMemo, useState } from "react";
import { getSalesReports } from "../../services/managerService";

export default function SalesReports() {
  const [reports, setReports] = useState([]);
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const filters = {
          ...(from && { from }),
          ...(to && { to }),
        };
        const data = await getSalesReports(filters);
        setReports(data || []);
      } catch (err) {
        console.error("Error fetching sales reports:", err);
        setError("Failed to load sales reports");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [from, to]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return reports.filter((r) => {
      const okQ = s ? r.date?.toLowerCase().includes(s) : true;
      return okQ;
    });
  }, [q, reports]);

  function exportCSV() {
    // Helper function to escape CSV fields
    const escapeCSV = (field) => {
      if (field === null || field === undefined) return "";
      const str = String(field);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Build CSV with header metadata and emojis
    const lines = [];
    lines.push("📊 SMART RETAIL PRO - SALES REPORT");
    lines.push("=".repeat(60));
    lines.push(`📅 Generated: ${new Date().toLocaleString()}`);
    lines.push(`🏢 Branch: Colombo Main`);
    lines.push(`📆 Period: ${from ? `From ${from}` : "All"} ${to ? `To ${to}` : ""}`);
    lines.push("=".repeat(60));
    lines.push(""); // Empty line
    
    // Column headers with emojis
    lines.push(["📅 Date", "📄 Invoices", "💰 Revenue (LKR)", "📈 Profit (LKR)"].map(escapeCSV).join(","));
    lines.push("-".repeat(60));
    
    // Data rows with alternating indicators
    filtered.forEach((r, idx) => {
      const emoji = idx % 2 === 0 ? "✓" : "→";
      lines.push(
        [
          `${emoji} ${r.date}`,
          r.invoices,
          r.revenue || 0,
          r.profit || 0,
        ]
          .map(escapeCSV)
          .join(",")
      );
    });
    
    // Separator for totals
    lines.push("-".repeat(60));
    lines.push("");
    
    // Totals row with emoji
    lines.push(
      [
        "🎯 TOTAL",
        totals.invoices,
        totals.revenue,
        totals.profit,
      ]
        .map(escapeCSV)
        .join(",")
    );
    
    lines.push("=".repeat(60));
    lines.push("✅ End of Report");

    // Add BOM for Excel compatibility
    const csv = "\uFEFF" + lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-report-${from || "all"}-${to || "all"}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totals = filtered.reduce(
    (acc, r) => ({
      invoices: acc.invoices + (r.invoices || 0),
      revenue: acc.revenue + (r.revenue || 0),
      profit: acc.profit + (r.profit || 0),
    }),
    { invoices: 0, revenue: 0, profit: 0 }
  );

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-extrabold">Sales Reports</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

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
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-100 border border-brand-border hover:bg-slate-200 transition text-sm font-bold disabled:opacity-50"
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
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-brand-muted">
                    Loading reports...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-brand-muted" colSpan={4}>
                    No records
                  </td>
                </tr>
              ) : (
                <>
                  {filtered.map((r) => (
                    <tr key={r.date} className="border-t hover:bg-slate-50">
                      <td className="p-3 font-mono text-xs">{r.date}</td>
                      <td className="p-3 text-right">{r.invoices}</td>
                      <td className="p-3 text-right font-bold">{(r.revenue || 0).toLocaleString()}</td>
                      <td className="p-3 text-right">{(r.profit || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="border-t bg-slate-50">
                    <td className="p-3 font-bold">TOTAL</td>
                    <td className="p-3 text-right font-bold">{totals.invoices}</td>
                    <td className="p-3 text-right font-extrabold">{totals.revenue.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold">{totals.profit.toLocaleString()}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
