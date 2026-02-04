import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getUsers } from "../../shared/storage";
import axios from "axios";
import { X } from "lucide-react";

export default function Terminals() {
  const [q, setQ] = useState("");
  const [terminals, setTerminals] = useState([
    { id: "POS-001", name: "Terminal 1", branch: "Colombo Main", location: "Counter 1", status: "Active", assignedUser: "John Perera" },
    { id: "POS-002", name: "Terminal 2", branch: "Colombo Main", location: "Counter 2", status: "Active", assignedUser: "Anne Silva" },
    { id: "POS-003", name: "Terminal 3", branch: "Kandy", location: "Main Counter", status: "Inactive", assignedUser: "" },
  ]);
  const [form, setForm] = useState({ id: "", name: "", branch: "", location: "", assignedUser: "", status: "Inactive" });
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedTerminal, setSelectedTerminal] = useState(null);

  useEffect(() => {
    // Load users for assignment
    const usersList = getUsers();
    setUsers(usersList);

    // Get unique branches from users
    const uniqueBranches = [...new Set(usersList.map(u => u.branch))];
    setBranches(uniqueBranches);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return terminals;
    return terminals.filter(
      (t) =>
        t.id.toLowerCase().includes(s) ||
        t.name.toLowerCase().includes(s) ||
        t.branch.toLowerCase().includes(s) ||
        t.location.toLowerCase().includes(s) ||
        t.status.toLowerCase().includes(s)
    );
  }, [q, terminals]);

  function onAdd(e) {
    e.preventDefault();
    if (!form.id || !form.name || !form.branch) return alert("Terminal ID, Name, and Branch are required");
    if (terminals.some((t) => t.id === form.id)) return alert("Terminal ID already exists");
    setTerminals([{ ...form }, ...terminals]);
    setForm({ id: "", name: "", branch: "", location: "", assignedUser: "", status: "Inactive" });
  }

  async function toggleStatus(terminalId) {
    const updatedTerminals = terminals.map((t) => {
      if (t.id !== terminalId) return t;
      const newStatus = t.status === "Active" ? "Inactive" : "Active";
      return { ...t, status: newStatus };
    });

    setTerminals(updatedTerminals);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Terminal Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form */}
        <div className="lg:col-span-1 bg-white border border-brand-border rounded-2xl shadow-sm p-5">
          <div className="font-bold mb-3">Add New Terminal</div>

          <form onSubmit={onAdd} className="space-y-3">
            <div>
              <label className="text-sm font-bold">Terminal ID</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
                placeholder="e.g., POS-004"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-bold">Terminal Name</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
                placeholder="e.g., Terminal 4"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-bold">Branch</label>
              <select
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border bg-white"
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold">Location</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
                placeholder="e.g., Counter 1"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-bold">Assign User</label>
              <select
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border bg-white"
                value={form.assignedUser}
                onChange={(e) => setForm({ ...form, assignedUser: e.target.value })}
              >
                <option value="">Select User</option>
                {users
                  .filter(u => form.branch ? u.branch === form.branch : true)
                  .map((user) => (
                    <option key={user.id} value={user.fullName}>
                      {user.fullName} ({user.role})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold">Status</label>
              <select
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border bg-white"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold transition"
            >
              Add Terminal
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="font-bold">Terminal List</div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search terminal..."
              className="w-full sm:w-80 px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left p-3">Terminal ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Branch</th>
                  <th className="text-left p-3">Location</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-t hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedTerminal(t)}>
                    <td className="p-3 font-mono text-xs">{t.id}</td>
                    <td className="p-3 font-bold">{t.name}</td>
                    <td className="p-3">{t.branch}</td>
                    <td className="p-3">{t.location}</td>
                    <td className="p-3">
                      <span
                        className={[
                          "text-xs px-3 py-1 rounded-full text-white font-bold",
                          t.status === "Active" ? "bg-brand-success" : "bg-slate-500",
                        ].join(" ")}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(t.id);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${t.status === "Active"
                          ? "bg-white border-brand-border hover:bg-slate-50"
                          : "bg-brand-primary text-white border-brand-primary hover:bg-brand-secondary"
                          }`}
                      >
                        {t.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td className="p-6 text-center text-brand-muted" colSpan={6}>
                      No terminals found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Terminal Detail Modal */}
      {selectedTerminal && createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-brand-border sticky top-0 bg-white">
              <h2 className="text-2xl font-extrabold">{selectedTerminal.name}</h2>
              <button
                onClick={() => setSelectedTerminal(null)}
                className="text-slate-500 hover:text-slate-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Terminal Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-bold text-slate-600 mb-1">Terminal ID</div>
                  <div className="text-lg font-mono">{selectedTerminal.id}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-600 mb-1">Branch</div>
                  <div className="text-lg">{selectedTerminal.branch}</div>
                </div>
              </div>

              {/* Location */}
              <div>
                <div className="text-sm font-bold text-slate-600 mb-1">Location</div>
                <div className="bg-slate-50 p-4 rounded-xl">{selectedTerminal.location}</div>
              </div>

              {/* Assigned User */}
              <div>
                <div className="text-sm font-bold text-slate-600 mb-2">Assigned User</div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  {selectedTerminal.assignedUser ? (
                    <div>
                      <div className="font-bold text-blue-900">{selectedTerminal.assignedUser}</div>
                      <div className="text-sm text-blue-700">Assigned Cashier/Operator</div>
                    </div>
                  ) : (
                    <div className="text-slate-500">No user assigned</div>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <div className="text-sm font-bold text-slate-600 mb-2">Status</div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold text-white ${selectedTerminal.status === "Active" ? "bg-brand-success" : "bg-slate-500"
                      }`}
                  >
                    {selectedTerminal.status}
                  </span>
                </div>
              </div>

              {/* Terminal Details */}
              <div>
                <div className="text-sm font-bold text-slate-600 mb-2">Terminal Details</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Device Type:</span>
                    <span className="font-bold">POS Terminal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">IP Address:</span>
                    <span className="font-mono">192.168.1.{Math.floor(Math.random() * 255)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Last Activity:</span>
                    <span className="text-sm">Today at {Math.floor(Math.random() * 12 + 1)}:{Math.floor(Math.random() * 60).toString().padStart(2, '0')} AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
