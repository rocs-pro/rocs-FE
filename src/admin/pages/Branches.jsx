import { useMemo, useState } from "react";
import { branches as initialBranches } from "../data/mockData";

export default function Branches() {
  const [q, setQ] = useState("");
  const [branches, setBranches] = useState(initialBranches);
  const [form, setForm] = useState({ id: "", name: "", address: "", status: "Active" });

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return branches;
    return branches.filter(
      (b) =>
        b.id.toLowerCase().includes(s) ||
        b.name.toLowerCase().includes(s) ||
        b.address.toLowerCase().includes(s) ||
        b.status.toLowerCase().includes(s)
    );
  }, [q, branches]);

  function onAdd(e) {
    e.preventDefault();
    if (!form.id || !form.name) return alert("Branch ID and Name are required");
    if (branches.some((b) => b.id === form.id)) return alert("Branch ID already exists");
    setBranches([{ ...form }, ...branches]);
    setForm({ id: "", name: "", address: "", status: "Active" });
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Create & Manage Branches</h1>

      <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5 space-y-4">
        <div className="font-bold">Add New Branch</div>

        <form onSubmit={onAdd} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            className="px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
            placeholder="Branch ID (e.g., BR-004)"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
          />
          <input
            className="px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
            placeholder="Branch Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
            placeholder="Address / City"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <select
            className="px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <button
            type="submit"
            className="md:col-span-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold transition"
          >
            Create Branch
          </button>
        </form>
      </div>

      <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-bold">Branch List</div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search branch..."
            className="w-full sm:w-80 px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3">Branch ID</th>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Address</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-t hover:bg-slate-50">
                  <td className="p-3 font-mono text-xs">{b.id}</td>
                  <td className="p-3 font-bold">{b.name}</td>
                  <td className="p-3">{b.address}</td>
                  <td className="p-3">
                    <span
                      className={[
                        "text-xs px-3 py-1 rounded-full text-white font-bold",
                        b.status === "Active" ? "bg-brand-success" : "bg-slate-500",
                      ].join(" ")}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-brand-muted" colSpan={4}>
                    No branches found
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
