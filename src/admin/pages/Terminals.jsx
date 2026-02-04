import { useMemo, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { getUsers } from "../../shared/storage";
import axios from "axios";
import { X, Eye, MoreVertical, Edit, Trash2, Power, Monitor } from "lucide-react";

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
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editTerminal, setEditTerminal] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
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

  function handleEditTerminal(terminal) {
    setEditTerminal(terminal);
    setForm({
      id: terminal.id,
      name: terminal.name,
      branch: terminal.branch,
      location: terminal.location,
      assignedUser: terminal.assignedUser || "",
      status: terminal.status
    });
    setActiveDropdown(null);
  }

  function handleSaveEdit(e) {
    e.preventDefault();
    if (!form.name || !form.branch) return alert("Terminal Name and Branch are required");
    setTerminals(terminals.map(t =>
      t.id === editTerminal.id ? { ...t, name: form.name, branch: form.branch, location: form.location, assignedUser: form.assignedUser, status: form.status } : t
    ));
    setEditTerminal(null);
    setForm({ id: "", name: "", branch: "", location: "", assignedUser: "", status: "Inactive" });
  }

  function handleDeleteTerminal(terminalId) {
    if (window.confirm("Are you sure you want to delete this terminal?")) {
      setTerminals(terminals.filter(t => t.id !== terminalId));
      setActiveDropdown(null);
    }
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
              <span className="text-sm font-medium text-blue-700">Editing: {editTerminal.name}</span>
            </div>
          )}
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold">{editTerminal ? "Edit Terminal" : "Add New Terminal"}</div>
            {editTerminal && (
              <button
                onClick={() => {
                  setEditTerminal(null);
                  setForm({ id: "", name: "", branch: "", location: "", assignedUser: "", status: "Inactive" });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
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
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                disabled={!!editTerminal}
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
                {filtered.map((t) => (
                  <tr key={t.id} className="border-t hover:bg-slate-50">
                    <td className="p-3 font-mono text-xs">{t.id}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                          <Monitor size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{t.name}</span>
                          <span className="text-xs text-gray-500">{t.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{t.branch}</td>
                    <td className="p-3">{t.location}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          t.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          ref={(el) => (dropdownButtonRefs.current[t.id] = el)}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(t.id);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
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

      {/* Dropdown Portal */}
      {activeDropdown && createPortal(
        <div 
          className="fixed w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-[200] py-1 animate-in fade-in zoom-in duration-200"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              const terminal = terminals.find(t => t.id === activeDropdown);
              setSelectedTerminal(terminal);
              setActiveDropdown(null);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Eye size={14} /> View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const terminal = terminals.find(t => t.id === activeDropdown);
              handleEditTerminal(terminal);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Edit size={14} /> Edit Terminal
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleStatus(activeDropdown);
              setActiveDropdown(null);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Power size={14} /> {terminals.find(t => t.id === activeDropdown)?.status === "Active" ? "Deactivate" : "Activate"}
          </button>
          <div className="h-px bg-gray-100 my-1"></div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteTerminal(activeDropdown);
            }}
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
