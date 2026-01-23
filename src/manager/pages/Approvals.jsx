import { useState } from "react";
import Badge from "../components/Badge";
import { approvals as initialApprovals } from "../data/managerMockData";
import ActionDropdown from "../components/ActionDropdown";

export default function Approvals() {
  const [rows, setRows] = useState(initialApprovals);

  function setStatus(id, status) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Approvals</h1>

      <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 font-bold">Pending Requests</div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Reference</th>
                <th className="text-left p-3">Requested By</th>
                <th className="text-left p-3">Time</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t hover:bg-slate-50">
                  <td className="p-3 font-mono text-xs">{r.id}</td>
                  <td className="p-3 font-semibold">{r.category}</td>
                  <td className="p-3">{r.reference}</td>
                  <td className="p-3">{r.requestedBy}</td>
                  <td className="p-3 text-brand-muted">{r.time}</td>
                  <td className="p-3">
                    <Badge label={r.status} />
                  </td>
                  <td className="p-3">
                    <ActionDropdown
                      disabled={r.status !== "Pending"}
                      onApprove={() => setStatus(r.id, "Approved")}
                      onReject={() => setStatus(r.id, "Rejected")}
                    />
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-brand-muted" colSpan={7}>
                    No approvals
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-brand-muted">
        Note: These actions update UI only. Later connect to backend approval endpoints.
      </p>
    </div>
  );
}
