import { profitAndLoss } from "../data/managerMockData";

export default function ProfitLoss() {
  const totalExpenses = profitAndLoss.expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = profitAndLoss.grossProfit - totalExpenses;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Profit & Loss</h1>

      <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="font-bold">Period</div>
          <div className="text-sm text-brand-muted">{profitAndLoss.period}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl border border-brand-border bg-slate-50">
            <div className="text-sm text-brand-muted">Revenue</div>
            <div className="text-xl font-extrabold">LKR {profitAndLoss.revenue.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl border border-brand-border bg-slate-50">
            <div className="text-sm text-brand-muted">COGS</div>
            <div className="text-xl font-extrabold">LKR {profitAndLoss.cogs.toLocaleString()}</div>
          </div>
          <div className="p-4 rounded-xl border border-brand-border bg-slate-50">
            <div className="text-sm text-brand-muted">Gross Profit</div>
            <div className="text-xl font-extrabold">LKR {profitAndLoss.grossProfit.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 font-bold bg-slate-50">Expenses</div>
          <table className="w-full text-sm">
            <tbody>
              {profitAndLoss.expenses.map((e, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">{e.name}</td>
                  <td className="p-3 text-right font-bold">LKR {e.amount.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="border-t bg-slate-50">
                <td className="p-3 font-bold">Total Expenses</td>
                <td className="p-3 text-right font-extrabold">LKR {totalExpenses.toLocaleString()}</td>
              </tr>
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
