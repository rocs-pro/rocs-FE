import { chartOfAccounts } from "../data/managerMockData";

export default function ChartOfAccounts() {
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
