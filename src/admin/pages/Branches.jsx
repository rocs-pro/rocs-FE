import { useMemo, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { branches as initialBranches } from "../data/mockData";
import { getUsers } from "../../shared/storage";
import axios from "axios";
import { X, Eye, MoreVertical, Edit, Trash2, Power, MapPin } from "lucide-react";

export default function Branches() {
  const [q, setQ] = useState("");
  const [branches, setBranches] = useState(initialBranches);
  const [form, setForm] = useState({ id: "", name: "", address: "", manager: "", status: "Inactive" });
  const [managers, setManagers] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editBranch, setEditBranch] = useState(null);
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
    // Load managers and users
    const users = getUsers();
    const managerList = users.filter((u) => u.role === "Manager");
    setManagers(managerList);
    setAllUsers(users);
  }, []);

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
    setForm({ id: "", name: "", address: "", manager: "", status: "Inactive" });
  }

  async function toggleStatus(branchId) {
    const updatedBranches = branches.map((b) => {
      if (b.id !== branchId) return b;
      const newStatus = b.status === "Active" ? "Inactive" : "Active";

      // Send email if branch is being activated
      if (newStatus === "Active") {
        sendBranchActivationEmail(b.name);
      }

      return { ...b, status: newStatus };
    });

    setBranches(updatedBranches);
  }

  async function sendBranchActivationEmail(branchName) {
    try {
      // Call API to send email to branch manager
      await axios.post("http://localhost:8080/api/email/send-branch-activation", {
        branchName: branchName,
        message: `Your branch "${branchName}" has been activated and is now live in the system.`,
      });
      alert(`Email sent to ${branchName} manager: Branch has been activated`);
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Branch status updated, but email notification failed. Please verify manually.");
    }
  }

  function handleEditBranch(branch) {
    setEditBranch(branch);
    setForm({
      id: branch.id,
      name: branch.name,
      address: branch.address,
      manager: branch.manager || "",
      status: branch.status
    });
    setActiveDropdown(null);
  }

  function handleSaveEdit(e) {
    e.preventDefault();
    if (!form.name) return alert("Branch Name is required");
    setBranches(branches.map(b =>
      b.id === editBranch.id ? { ...b, name: form.name, address: form.address, manager: form.manager, status: form.status } : b
    ));
    setEditBranch(null);
    setForm({ id: "", name: "", address: "", manager: "", status: "Inactive" });
  }

  function handleDeleteBranch(branchId) {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      setBranches(branches.filter(b => b.id !== branchId));
      setActiveDropdown(null);
    }
  }

  return (
    <div className="space-y-4" onClick={() => setActiveDropdown(null)}>
      <h1 className="text-xl font-extrabold">Create & Manage Branches</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form */}
        <div className={`lg:col-span-1 bg-white border rounded-2xl shadow-sm p-5 transition-all duration-300 ${editBranch ? 'border-blue-400 ring-2 ring-blue-100' : 'border-brand-border'}`}>
          {editBranch && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <Edit size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Editing: {editBranch.name}</span>
            </div>
          )}
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold">{editBranch ? "Edit Branch" : "Add New Branch"}</div>
            {editBranch && (
              <button
                onClick={() => {
                  setEditBranch(null);
                  setForm({ id: "", name: "", address: "", manager: "", status: "Inactive" });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <form onSubmit={editBranch ? handleSaveEdit : onAdd} className="space-y-3">
            <div>
              <label className="text-sm font-bold">Branch ID</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="e.g., BR-004"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                disabled={!!editBranch}
              />
            </div>

            <div>
              <label className="text-sm font-bold">Branch Name</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
                placeholder="e.g., Colombo Branch"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-bold">Address / City</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
                placeholder="e.g., Colombo"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-bold">Branch Manager</label>
              <select
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border bg-white"
                value={form.manager}
                onChange={(e) => setForm({ ...form, manager: e.target.value })}
              >
                <option value="">Select Manager</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.fullName}>
                    {m.fullName} ({m.branch})
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
              {editBranch ? "Save Changes" : "Create Branch"}
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 bg-white border border-brand-border rounded-2xl shadow-sm overflow-visible">
          <div className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="font-bold">Branch List</div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search branch..."
              className="w-full sm:w-80 px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
            />
          </div>

          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left p-3">Branch ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Address</th>
                  <th className="text-left p-3">Manager</th>
                  <th className="text-center p-3">Status</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-t hover:bg-slate-50">
                    <td className="p-3 font-mono text-xs">{b.id}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                          <MapPin size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{b.name}</span>
                          <span className="text-xs text-gray-500">{b.address}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{b.address}</td>
                    <td className="p-3 text-sm">{b.manager || "-"}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          b.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          ref={(el) => (dropdownButtonRefs.current[b.id] = el)}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(b.id);
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
                      No branches found
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
              const branch = branches.find(br => br.id === activeDropdown);
              setSelectedBranch(branch);
              setActiveDropdown(null);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Eye size={14} /> View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const branch = branches.find(br => br.id === activeDropdown);
              handleEditBranch(branch);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Edit size={14} /> Edit Branch
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleStatus(activeDropdown);
              setActiveDropdown(null);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Power size={14} /> {branches.find(br => br.id === activeDropdown)?.status === "Active" ? "Deactivate" : "Activate"}
          </button>
          <div className="h-px bg-gray-100 my-1"></div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteBranch(activeDropdown);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>,
        document.body
      )}

      {/* Branch Detail Modal */}
      {selectedBranch && createPortal(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-brand-border sticky top-0 bg-white">
              <h2 className="text-2xl font-extrabold">{selectedBranch.name}</h2>
              <button
                onClick={() => setSelectedBranch(null)}
                className="text-slate-500 hover:text-slate-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Branch Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-bold text-slate-600 mb-1">Branch ID</div>
                  <div className="text-lg font-mono">{selectedBranch.id}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-600 mb-1">Location</div>
                  <div className="text-lg">{selectedBranch.address}</div>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="text-sm font-bold text-slate-600 mb-2">Description</div>
                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700">
                  {selectedBranch.description || `Branch ${selectedBranch.name} - Location: ${selectedBranch.address}`}
                </div>
              </div>

              {/* Branch Manager */}
              <div>
                <div className="text-sm font-bold text-slate-600 mb-2">Branch Manager</div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  {selectedBranch.manager ? (
                    <div>
                      <div className="font-bold text-blue-900">{selectedBranch.manager}</div>
                      <div className="text-sm text-blue-700">Assigned Manager</div>
                    </div>
                  ) : (
                    <div className="text-slate-500">No manager assigned</div>
                  )}
                </div>
              </div>

              {/* Users in Branch */}
              <div>
                <div className="text-sm font-bold text-slate-600 mb-2">Users ({allUsers.filter(u => u.branch === selectedBranch.name).length})</div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allUsers.filter(u => u.branch === selectedBranch.name).length > 0 ? (
                    allUsers.filter(u => u.branch === selectedBranch.name).map(user => (
                      <div key={user.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div className="font-bold text-sm">{user.fullName}</div>
                        <div className="text-xs text-slate-600">{user.role} • @{user.username}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500 text-sm p-3">No users assigned to this branch</div>
                  )}
                </div>
              </div>

              {/* Terminals */}
              <div>
                <div className="text-sm font-bold text-slate-600 mb-2">Terminals</div>
                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-700">
                  {selectedBranch.terminals ? (
                    <div className="space-y-2">
                      {selectedBranch.terminals.map((terminal, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 bg-brand-primary rounded-full"></span>
                          {terminal}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-500">No terminals configured</span>
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <div className="text-sm font-bold text-slate-600 mb-2">Status</div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold text-white ${selectedBranch.status === "Active" ? "bg-brand-success" : "bg-slate-500"
                      }`}
                  >
                    {selectedBranch.status}
                  </span>
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
