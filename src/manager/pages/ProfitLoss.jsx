import { useEffect, useState } from "react";
import { getProfitAndLoss } from "../../services/managerService";

export default function ProfitLoss() {
  const [plData, setPlData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("monthly");

  useEffect(() => {
    fetchProfitLoss();
  }, [period]);

  const fetchProfitLoss = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfitAndLoss(period);
      setPlData(data);
    } catch (err) {
      console.error("Error fetching P&L:", err);
      setError("Failed to load P&L report");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-extrabold">Profit & Loss</h1>
        <div className="text-center text-brand-muted">Loading P&L report...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-extrabold">Profit & Loss</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!plData) return null;

  const totalExpenses = plData.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;
  const netProfit = (plData.grossProfit || 0) - totalExpenses;

  const exportCSV = () => {
    // Get branch name from user data
    const getBranchName = () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          return user.branchName || user.branch || "Main Branch";
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
      return "Main Branch";
    };

    const escapeCSV = (field) => {
      if (field === null || field === undefined) return "";
      const str = String(field);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const lines = [];
    lines.push("📈 SMART RETAIL PRO - PROFIT & LOSS REPORT");
    lines.push("=".repeat(70));
    lines.push(`📅 Generated: ${new Date().toLocaleString()}`);
    lines.push(`🏢 Branch: ${getBranchName()}`);
    lines.push(`📆 Period: ${period.toUpperCase()}`);
    lines.push(`⏰ Report Date: ${plData.period}`);
    lines.push("=".repeat(70));
    lines.push("");

    lines.push("FINANCIAL SUMMARY");
    lines.push("-".repeat(70));
    lines.push(["Item", "Amount (LKR)"].map(escapeCSV).join(","));
    lines.push(["💵 Revenue", plData.revenue || 0].map(escapeCSV).join(","));
    lines.push(["📦 Cost of Goods Sold", plData.cogs || 0].map(escapeCSV).join(","));
    lines.push(["📊 Gross Profit", plData.grossProfit || 0].map(escapeCSV).join(","));
    lines.push("");

    lines.push("EXPENSES BREAKDOWN");
    lines.push("-".repeat(70));
    lines.push(["Expense Item", "Amount (LKR)"].map(escapeCSV).join(","));

    if (plData.expenses && plData.expenses.length > 0) {
      plData.expenses.forEach((e, idx) => {
        const emoji = idx % 2 === 0 ? "✓" : "→";
        lines.push([`${emoji} ${e.name}`, e.amount || 0].map(escapeCSV).join(","));
      });
    }

    lines.push("-".repeat(70));
    lines.push(["💸 Total Expenses", totalExpenses].map(escapeCSV).join(","));
    lines.push("");

    lines.push("BOTTOM LINE");
    lines.push("=".repeat(70));
    lines.push(["🎯 NET PROFIT/LOSS", netProfit].map(escapeCSV).join(","));
    lines.push("=".repeat(70));
    lines.push("✅ End of Report");

    const csv = "\uFEFF" + lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `profit-loss-${period}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl font-extrabold">Profit & Loss</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          <button
            type="button"
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold transition"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="font-bold">Period</div>
          <div className="text-sm text-brand-muted">{plData.period}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl border border-brand-border bg-slate-50">
            <div className="text-sm text-brand-muted">Revenue</div>
            <div className="text-xl font-extrabold">LKR {(plData.revenue || 0).toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl border border-brand-border bg-slate-50">
            <div className="text-sm text-brand-muted">COGS</div>
            <div className="text-xl font-extrabold">LKR {(plData.cogs || 0).toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl border border-brand-border bg-slate-50">
            <div className="text-sm text-brand-muted">Gross Profit</div>
            <div className="text-xl font-extrabold">LKR {(plData.grossProfit || 0).toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 font-bold bg-slate-50">Expenses</div>
          <table className="w-full text-sm">
            <tbody>
              {plData.expenses && plData.expenses.length > 0 ? (
                <>
                  {plData.expenses.map((e, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3">{e.name}</td>
                      <td className="p-3 text-right font-bold">LKR {(e.amount || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="border-t bg-slate-50">
                    <td className="p-3 font-bold">Total Expenses</td>
                    <td className="p-3 text-right font-extrabold">LKR {totalExpenses.toLocaleString()}</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan={2} className="p-3 text-center text-brand-muted">
                    No expenses
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-xl bg-brand-primary text-white flex items-center justify-between">
          <div className="font-bold">Net Profit</div>
          <div className="text-xl font-extrabold">LKR {netProfit.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
