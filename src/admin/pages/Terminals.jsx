import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Edit, Trash2, Power, Monitor, Loader2 } from "lucide-react";
import {
  getAllTerminals,
  createTerminal,
  updateTerminal,
  deleteTerminal,
  toggleTerminalStatus,
  getAllBranches,
  getAllUsers,
} from "../services/adminApi";

export default function Terminals() {
  const [q, setQ] = useState("");
  const [terminals, setTerminals] = useState([]);
  const [form, setForm] = useState({ terminalId: "", terminalName: "", branchId: "", location: "", assignedUserId: "", status: "INACTIVE" });
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedTerminal, setSelectedTerminal] = useState(null);
  const [editTerminal, setEditTerminal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch terminals, users and branches on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [terminalsData, usersData, branchesData] = await Promise.all([
          getAllTerminals(),
          getAllUsers(),
          getAllBranches(),
        ]);
        setTerminals(terminalsData || []);
        setUsers(usersData || []);
        setBranches(branchesData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter terminals based on search
  const filtered = terminals.filter((t) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    const terminalCode = t.terminalCode || ""; // Display ID
    const terminalName = t.name || t.terminalName || "";
    // Lookup branch name
    const branch = branches.find(b => getBranchId(b) === t.branchId);
    const branchName = branch ? getBranchName(branch) : "";

    return (
      terminalCode.toLowerCase().includes(s) ||
      terminalName.toLowerCase().includes(s) ||
      branchName.toLowerCase().includes(s)
    );
  });

  const resetForm = () => {
    setForm({ terminalId: "", terminalName: "", branchId: "", location: "", assignedUserId: "", status: "INACTIVE" });
    setEditTerminal(null);
  };

  async function onAdd(e) {
    e.preventDefault();
    if (!form.terminalId || !form.terminalName || !form.branchId) return alert("Terminal ID, Name, and Branch are required");

    try {
      setSubmitting(true);
      // Map to Backend Entity
      const payload = {
        terminalCode: form.terminalId,
        name: form.terminalName,
        branchId: form.branchId,
        // location: form.location, // Not supported by backend 
        // assignedUserId: form.assignedUserId, // Not supported by backend
        isActive: form.status === "ACTIVE"
      };

      await createTerminal(payload);
      const data = await getAllTerminals();
      setTerminals(data || []);
      resetForm();
    } catch (err) {
      console.error("Error creating terminal:", err);
      const msg = err.response?.data?.message || "";
      if (msg.includes("exists") || msg.includes("Duplicate")) {
        alert("Terminal ID already exists");
      } else {
        alert("Failed to create terminal. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleStatus(terminalId) {
    try {
      await toggleTerminalStatus(terminalId);
      const data = await getAllTerminals();
      setTerminals(data || []);
    } catch (err) {
      console.error("Error toggling status:", err);
      alert("Failed to update terminal status. Please try again.");
    }
  }

  function handleEditTerminal(terminal) {
    setEditTerminal(terminal);
    setForm({
      terminalId: terminal.terminalCode || "", // Display ID
      terminalName: terminal.name || "",
      branchId: terminal.branchId || "",
      location: "", // Not supported
      assignedUserId: "", // Not supported
      status: terminal.isActive ? "ACTIVE" : "INACTIVE"
    });
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!form.terminalName || !form.branchId) return alert("Terminal Name and Branch are required");

    try {
      setSubmitting(true);
      const pkId = editTerminal.terminalId; // The PK
      const payload = {
        terminalCode: form.terminalId,
        name: form.terminalName,
        branchId: form.branchId,
        isActive: form.status === "ACTIVE"
      };

      await updateTerminal(pkId, payload);
      const data = await getAllTerminals();
      setTerminals(data || []);
      resetForm();
    } catch (err) {
      console.error("Error updating terminal:", err);
      alert("Failed to update terminal. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteTerminal(terminalId) {
    if (window.confirm("Are you sure you want to delete this terminal?")) {
      try {
        await deleteTerminal(terminalId);
        const data = await getAllTerminals();
        setTerminals(data || []);
      } catch (err) {
        console.error("Error deleting terminal:", err);
        alert("Failed to delete terminal. Please try again.");
      }
    }
  }

  // Helpers
  const getBranchId = (b) => b.id || b.branchId || b.branch_id;
  const getBranchName = (b) => b.name || b.branchName || b.branch_name;

  // Terminal Helpers
  // We use PK for operations, but terminalCode for display "ID"
  const getTerminalPk = (t) => t.terminalId;
  const getTerminalCode = (t) => t.terminalCode;

  const isActive = (t) => {
    if (t === undefined) return false;
    if (typeof t === 'object') return t.isActive === true;
    return t === "ACTIVE" || t === "Active" || t === true;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Terminal Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form */}
        <div className={`lg:col-span-1 bg-white border rounded-2xl shadow-sm p-5 transition-all duration-300 ${editTerminal ? 'border-blue-400 ring-2 ring-blue-100' : 'border-brand-border'}`}>
          {editTerminal && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <Edit size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Editing: {editTerminal.name}</span>
            </div>
          )}
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold">{editTerminal ? "Edit Terminal" : "Add New Terminal"}</div>
            {editTerminal && (
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            )}
          </div>

          <form onSubmit={editTerminal ? handleSaveEdit : onAdd} className="space-y-3">
            <div>
              <label className="text-sm font-bold">Terminal ID (Code)</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="e.g., POS-004"
                value={form.terminalId}
                onChange={(e) => setForm({ ...form, terminalId: e.target.value })}
              // allow editing code? Usually yes, unless PK. Code is unique but mutable.
              />
            </div>

            <div>
              <label className="text-sm font-bold">Terminal Name</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
                placeholder="e.g., Terminal 4"
                value={form.terminalName}
                onChange={(e) => setForm({ ...form, terminalName: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-bold">Branch</label>
              <select
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border bg-white"
                value={form.branchId}
                onChange={(e) => setForm({ ...form, branchId: e.target.value })}
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={getBranchId(branch)} value={getBranchId(branch)}>
                    {getBranchName(branch)}
                  </option>
                ))}
              </select>
            </div>

            {/* Location & User Removed as backend doesn't support them yet */}

            <div>
              <label className="text-sm font-bold">Status</label>
              <select
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border bg-white"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {editTerminal ? "Save Changes" : "Add Terminal"}
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 bg-white border border-brand-border rounded-2xl shadow-sm overflow-visible">
          <div className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="font-bold">Terminal List</div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search terminal..."
              className="w-full sm:w-80 px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
            />
          </div>

          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left p-3">Terminal ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Branch</th>
                  <th className="text-center p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const pkId = getTerminalPk(t);
                  const terminalCode = getTerminalCode(t);
                  const terminalName = t.name;

                  // Lookup branch name
                  const branch = branches.find(b => getBranchId(b) === t.branchId);
                  const branchName = branch ? getBranchName(branch) : "Unknown Branch";

                  return (
                    <tr
                      key={pkId}
                      className="border-t hover:bg-slate-50 cursor-pointer"
                      onClick={() => setSelectedTerminal(t)}
                    >
                      <td className="p-3 font-mono text-xs">{terminalCode}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                            <Monitor size={18} />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{terminalName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">{branchName}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${isActive(t) ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                        >
                          {isActive(t) ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td className="p-6 text-center text-brand-muted" colSpan={5}>
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
              <h2 className="text-2xl font-extrabold">Manage Terminal</h2>
              <button
                onClick={() => setSelectedTerminal(null)}
                className="text-slate-500 hover:text-slate-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-bold text-slate-600 mb-1">Terminal ID (Code)</div>
                  <div className="text-lg font-mono">{selectedTerminal.terminalCode}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-600 mb-1">Branch</div>
                  <div className="text-lg">
                    {(() => {
                      const b = branches.find(br => getBranchId(br) === selectedTerminal.branchId);
                      return b ? getBranchName(b) : "Unknown Branch";
                    })()}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-slate-600 mb-2">Status</div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${isActive(selectedTerminal) ? "bg-brand-success" : "bg-slate-500"}`}>
                  {isActive(selectedTerminal) ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100">
                <button
                  onClick={() => {
                    handleEditTerminal(selectedTerminal);
                    setSelectedTerminal(null);
                  }}
                  className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                >
                  <Edit size={20} />
                  <span className="text-xs font-bold">Edit</span>
                </button>

                <button
                  onClick={() => {
                    handleToggleStatus(getTerminalPk(selectedTerminal));
                    setSelectedTerminal(null);
                  }}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition ${isActive(selectedTerminal)
                    ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                >
                  <Power size={20} />
                  <span className="text-xs font-bold">
                    {isActive(selectedTerminal) ? "Deactivate" : "Activate"}
                  </span>
                </button>

                <button
                  onClick={() => {
                    handleDeleteTerminal(getTerminalPk(selectedTerminal));
                    setSelectedTerminal(null);
                  }}
                  className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition"
                >
                  <Trash2 size={20} />
                  <span className="text-xs font-bold">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
