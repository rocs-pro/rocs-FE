import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Eye, MoreVertical, Edit, Trash2, Power, Monitor, Loader2 } from "lucide-react";
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
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editTerminal, setEditTerminal] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const dropdownButtonRefs = useRef({});

  const toggleDropdown = (id) => {
    if (activeDropdown === id) {
      setActiveDropdown(null);
    } else {
      const button = dropdownButtonRefs.current[id];
      if (button) {
        const rect = button.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX - 160
        });
      }
      setActiveDropdown(id);
    }
  };

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
    const terminalId = t.terminalId || t.terminal_id || "";
    const terminalName = t.terminalName || t.terminal_name || "";
    const branchName = t.branchName || t.branch_name || "";
    const location = t.location || "";
    const status = t.status || "";
    return (
      terminalId.toLowerCase().includes(s) ||
      terminalName.toLowerCase().includes(s) ||
      branchName.toLowerCase().includes(s) ||
      location.toLowerCase().includes(s) ||
      status.toLowerCase().includes(s)
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
      await createTerminal(form);
      const data = await getAllTerminals();
      setTerminals(data || []);
      resetForm();
    } catch (err) {
      console.error("Error creating terminal:", err);
      if (err.response?.data?.message?.includes("exists")) {
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
      setActiveDropdown(null);
    } catch (err) {
      console.error("Error toggling status:", err);
      alert("Failed to update terminal status. Please try again.");
    }
  }

  function handleEditTerminal(terminal) {
    setEditTerminal(terminal);
    setForm({
      terminalId: terminal.terminalId || terminal.terminal_id || "",
      terminalName: terminal.terminalName || terminal.terminal_name || "",
      branchId: terminal.branchId || terminal.branch_id || "",
      location: terminal.location || "",
      assignedUserId: terminal.assignedUserId || terminal.assigned_user_id || "",
      status: terminal.status || "INACTIVE"
    });
    setActiveDropdown(null);
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!form.terminalName || !form.branchId) return alert("Terminal Name and Branch are required");
    
    try {
      setSubmitting(true);
      const terminalId = editTerminal.terminalId || editTerminal.terminal_id;
      await updateTerminal(terminalId, form);
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
        setActiveDropdown(null);
      } catch (err) {
        console.error("Error deleting terminal:", err);
        alert("Failed to delete terminal. Please try again.");
      }
    }
  }

  const getTerminalId = (t) => t.terminalId || t.terminal_id;
  const getTerminalName = (t) => t.terminalName || t.terminal_name;
  const getBranchId = (b) => b.branchId || b.branch_id;
  const getBranchName = (b) => b.branchName || b.branch_name;
  const isActive = (status) => status === "ACTIVE" || status === "Active";

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
    <div className="space-y-4" onClick={() => setActiveDropdown(null)}>
      <h1 className="text-xl font-extrabold">Terminal Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form */}
        <div className={`lg:col-span-1 bg-white border rounded-2xl shadow-sm p-5 transition-all duration-300 ${editTerminal ? 'border-blue-400 ring-2 ring-blue-100' : 'border-brand-border'}`}>
          {editTerminal && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <Edit size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Editing: {getTerminalName(editTerminal)}</span>
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
              <label className="text-sm font-bold">Terminal ID</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="e.g., POS-004"
                value={form.terminalId}
                onChange={(e) => setForm({ ...form, terminalId: e.target.value })}
                disabled={!!editTerminal}
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
                value={form.assignedUserId}
                onChange={(e) => setForm({ ...form, assignedUserId: e.target.value })}
              >
                <option value="">Select User</option>
                {users
                  .filter(u => form.branchId ? (u.branchId || u.branch_id) === form.branchId : true)
                  .map((user) => {
                    const userId = user.userId || user.user_id || user.id;
                    const userName = user.fullName || user.full_name;
                    return (
                      <option key={userId} value={userId}>
                        {userName} ({user.role})
                      </option>
                    );
                  })}
              </select>
            </div>

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
                  <th className="text-left p-3">Location</th>
                  <th className="text-center p-3">Status</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const terminalId = getTerminalId(t);
                  const terminalName = getTerminalName(t);
                  const branchName = t.branchName || t.branch_name || "-";
                  return (
                    <tr key={terminalId} className="border-t hover:bg-slate-50">
                      <td className="p-3 font-mono text-xs">{terminalId}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                            <Monitor size={18} />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{terminalName}</span>
                            <span className="text-xs text-gray-500">{t.location}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">{branchName}</td>
                      <td className="p-3">{t.location}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            isActive(t.status) ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          ref={(el) => (dropdownButtonRefs.current[terminalId] = el)}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(terminalId);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
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

      {/* Dropdown Portal */}
      {activeDropdown && createPortal(
        <div 
          className="fixed w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-[200] py-1"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              const terminal = terminals.find(t => getTerminalId(t) === activeDropdown);
              setSelectedTerminal(terminal);
              setActiveDropdown(null);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Eye size={14} /> View Details
          </button>
          <button
            onClick={() => handleEditTerminal(terminals.find(t => getTerminalId(t) === activeDropdown))}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Edit size={14} /> Edit Terminal
          </button>
          <button
            onClick={() => handleToggleStatus(activeDropdown)}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Power size={14} /> {isActive(terminals.find(t => getTerminalId(t) === activeDropdown)?.status) ? "Deactivate" : "Activate"}
          </button>
          <div className="h-px bg-gray-100 my-1"></div>
          <button
            onClick={() => handleDeleteTerminal(activeDropdown)}
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>,
        document.body
      )}

      {/* Terminal Detail Modal */}
      {selectedTerminal && createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-brand-border sticky top-0 bg-white">
              <h2 className="text-2xl font-extrabold">{getTerminalName(selectedTerminal)}</h2>
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
                  <div className="text-sm font-bold text-slate-600 mb-1">Terminal ID</div>
                  <div className="text-lg font-mono">{getTerminalId(selectedTerminal)}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-600 mb-1">Branch</div>
                  <div className="text-lg">{selectedTerminal.branchName || selectedTerminal.branch_name}</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-slate-600 mb-1">Location</div>
                <div className="bg-slate-50 p-4 rounded-xl">{selectedTerminal.location}</div>
              </div>

              <div>
                <div className="text-sm font-bold text-slate-600 mb-2">Assigned User</div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  {selectedTerminal.assignedUserName || selectedTerminal.assigned_user_name ? (
                    <div>
                      <div className="font-bold text-blue-900">{selectedTerminal.assignedUserName || selectedTerminal.assigned_user_name}</div>
                      <div className="text-sm text-blue-700">Assigned Cashier/Operator</div>
                    </div>
                  ) : (
                    <div className="text-slate-500">No user assigned</div>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-slate-600 mb-2">Status</div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${isActive(selectedTerminal.status) ? "bg-brand-success" : "bg-slate-500"}`}>
                  {selectedTerminal.status}
                </span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
