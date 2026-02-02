export default function Reports() {
  const exportDailySales = () => {
    const escapeCSV = (field) => {
      if (field === null || field === undefined) return "";
      const str = String(field);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const lines = [];
    lines.push("📊 SMART RETAIL PRO - DAILY SALES REPORT");
    lines.push("=".repeat(70));
    lines.push(`📅 Generated: ${new Date().toLocaleString()}`);
    lines.push(`🏢 Branch: Colombo Main`);
    lines.push("=".repeat(70));
    lines.push("");
    lines.push("Daily sales summary data for today's operations.");
    lines.push("");
    lines.push(["Date", "Sales Value (LKR)", "Transactions"].map(escapeCSV).join(","));
    lines.push([new Date().toISOString().split("T")[0], "0", "0"].map(escapeCSV).join(","));
    lines.push("=".repeat(70));
    lines.push("✅ End of Report");

    const csv = "\uFEFF" + lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daily-sales-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportStock = () => {
    const escapeCSV = (field) => {
      if (field === null || field === undefined) return "";
      const str = String(field);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const lines = [];
    lines.push("📦 SMART RETAIL PRO - STOCK VALUATION REPORT");
    lines.push("=".repeat(70));
    lines.push(`📅 Generated: ${new Date().toLocaleString()}`);
    lines.push(`🏢 Branch: Colombo Main`);
    lines.push("=".repeat(70));
    lines.push("");
    lines.push("Stock valuation report for inventory management.");
    lines.push("");
    lines.push(["SKU", "Product Name", "Quantity", "Unit Price (LKR)", "Total Value (LKR)"].map(escapeCSV).join(","));
    lines.push("=".repeat(70));
    lines.push("✅ End of Report");

    const csv = "\uFEFF" + lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stock-valuation-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
          <button 
            type="button" 
            onClick={exportDailySales}
            className="py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold transition"
          >
            📥 Download Daily Sales (CSV)
          </button>
          <button 
            type="button"
            onClick={exportStock}
            className="py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold transition"
          >
            📦 Export Stock (CSV)
          </button>
          <button type="button" className="py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold transition">
            ⭐ View Top Products
          </button>
        </div>
      </div>
    </div>
  );
}
