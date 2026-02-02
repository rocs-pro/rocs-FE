import { useEffect, useState } from "react";
import { getChartOfAccounts } from "../../services/managerService";

export default function ChartOfAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getChartOfAccounts();
        setAccounts(data || []);
      } catch (err) {
        console.error("Error fetching chart of accounts:", err);
        setError("Failed to load chart of accounts");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Chart of Accounts</h1>

      <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 font-bold">Accounts</div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3">Code</th>
                <th className="text-left p-3">Account Name</th>
                <th className="text-left p-3">Type</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-brand-muted">
                    Loading accounts...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-brand-muted" colSpan={3}>
                    No accounts
                  </td>
                </tr>
              ) : (
                accounts.map((a) => (
                  <tr key={a.code} className="border-t hover:bg-slate-50">
                    <td className="p-3 font-mono text-xs">{a.code}</td>
                    <td className="p-3 font-semibold">{a.name}</td>
                    <td className="p-3">{a.type}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}