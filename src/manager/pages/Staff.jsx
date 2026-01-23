import Badge from "../components/Badge";
import { staffSummary } from "../data/managerMockData";

export default function Staff() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Staff</h1>
      <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 font-bold">Staff Activity Summary</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Last Login</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {staffSummary.map((s) => (
                <tr key={s.name} className="border-t hover:bg-slate-50">
                  <td className="p-3 font-bold">{s.name}</td>
                  <td className="p-3">{s.role}</td>
                  <td className="p-3 text-brand-muted">{s.lastLogin}</td>
                  <td className="p-3"><Badge label={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
