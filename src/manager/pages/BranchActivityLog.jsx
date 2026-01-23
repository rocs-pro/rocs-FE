import { branchActivityLog } from "../data/managerMockData";
import Badge from "../components/Badge";

export default function BranchActivityLog() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Branch Activity Log</h1>

      <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 font-bold">Branch Audit Trail</div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3">Time</th>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Action</th>
                <th className="text-left p-3">Details</th>
                <th className="text-left p-3">Severity</th>
              </tr>
            </thead>
            <tbody>
              {branchActivityLog.map((e, i) => (
                <tr key={i} className="border-t hover:bg-slate-50">
                  <td className="p-3 text-brand-muted">{e.time}</td>
                  <td className="p-3 font-semibold">{e.user}</td>
                  <td className="p-3">{e.action}</td>
                  <td className="p-3">{e.details}</td>
                  <td className="p-3"><Badge label={e.severity} /></td>
                </tr>
              ))}
              {branchActivityLog.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-brand-muted" colSpan={5}>
                    No activity
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
