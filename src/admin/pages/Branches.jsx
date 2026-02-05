import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Eye, MoreVertical, Edit, Trash2, Power, MapPin, Loader2 } from "lucide-react";
import {
  getAllBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  toggleBranchStatus,
  getManagers,
  getUsersByBranch,
} from "../services/adminApi";

export default function Branches() {
  const [q, setQ] = useState("");
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ code: "", branchName: "", address: "", managerId: "", status: "INACTIVE" });
  const [managers, setManagers] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchUsers, setBranchUsers] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editBranch, setEditBranch] = useState(null);
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

  // Fetch branches and managers on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [branchesData, managersData] = await Promise.all([
          getAllBranches(),
          getManagers(),
        ]);
        setBranches(branchesData || []);
        setManagers(managersData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter branches based on search
  const filtered = branches.filter((b) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    const code = b.code || "";
    const branchName = b.branchName || b.branch_name || b.name || "";
    const address = b.address || "";
    const status = b.status || "";
    return (
      code.toLowerCase().includes(s) ||
      branchName.toLowerCase().includes(s) ||
      address.toLowerCase().includes(s) ||
      status.toLowerCase().includes(s)
    );
  });

  const resetForm = () => {
    setForm({ code: "", branchName: "", address: "", managerId: "", status: "INACTIVE" });
    setEditBranch(null);
  };

  async function onAdd(e) {
    e.preventDefault();
    if (!form.code || !form.branchName) return alert("Branch Code and Name are required");

    try {
      setSubmitting(true);
      // Map form to DTO structure
      const payload = {
        code: form.code,
        name: form.branchName,
        address: form.address,
        managerId: form.managerId,
        isActive: form.status === "ACTIVE"
      };
      await createBranch(payload);
      const data = await getAllBranches();
      setBranches(data || []);
      resetForm();
    } catch (err) {
      console.error("Error creating branch:", err);
      // Backend returns ResponseStatusException(BAD_REQUEST) which might be wrapped or come as err.response.data
      const msg = err.response?.data?.message || "";
      if (msg.includes("exists") || msg.includes("Duplicate")) {
        alert("Branch Code already exists");
      } else {
        alert("Failed to create branch. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleStatus(branchId) {
    try {
      await toggleBranchStatus(branchId);
      const data = await getAllBranches();
      setBranches(data || []);
      setActiveDropdown(null);
    } catch (err) {
      console.error("Error toggling status:", err);
      alert("Failed to update branch status. Please try again.");
    }
  }

  function handleEditBranch(branch) {
    setEditBranch(branch);
    setForm({
      code: branch.code || "",
      branchName: branch.branchName || branch.branch_name || branch.name || "",
      address: branch.address || "",
      managerId: branch.managerId || branch.manager_id || "",
      status: isActive(branch) ? "ACTIVE" : "INACTIVE"
    });
    setActiveDropdown(null);
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!form.branchName) return alert("Branch Name is required");

    try {
      setSubmitting(true);
      const branchId = getBranchId(editBranch);
      const payload = {
        code: form.code,
        name: form.branchName,
        address: form.address,
        managerId: form.managerId,
        isActive: form.status === "ACTIVE"
      };
      await updateBranch(branchId, payload);
      const data = await getAllBranches();
      setBranches(data || []);
      resetForm();
    } catch (err) {
      console.error("Error updating branch:", err);
      alert("Failed to update branch. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteBranch(branchId) {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      try {
        await deleteBranch(branchId);
        const data = await getAllBranches();
        setBranches(data || []);
        setActiveDropdown(null);
      } catch (err) {
        console.error("Error deleting branch:", err);
        alert("Failed to delete branch. Please try again.");
      }
    }
  }

  async function handleViewBranch(branch) {
    setSelectedBranch(branch);
    setActiveDropdown(null);
    try {
      const branchId = getBranchId(branch);
      const users = await getUsersByBranch(branchId);
      setBranchUsers(users || []);
    } catch (err) {
      console.error("Error fetching branch users:", err);
      setBranchUsers([]);
    }
  }

  const getBranchId = (b) => b.id || b.branchId || b.branch_id;
  const getBranchName = (b) => b.name || b.branchName || b.branch_name;
  const getBranchStatus = (b) => isActive(b) ? "ACTIVE" : "INACTIVE";
  const isActive = (b) => {
    if (typeof b === 'object') {
      return b.isActive === true || b.status === "ACTIVE" || b.status === "Active";
    }
    return b === "ACTIVE" || b === "Active" || b === true;
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
    <div className="space-y-4" onClick={() => setActiveDropdown(null)}>
      <h1 className="text-xl font-extrabold">Create & Manage Branches</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form */}
        <div className={`lg:col-span-1 bg-white border rounded-2xl shadow-sm p-5 transition-all duration-300 ${editBranch ? 'border-blue-400 ring-2 ring-blue-100' : 'border-brand-border'}`}>
          {editBranch && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <Edit size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Editing: {getBranchName(editBranch)}</span>
            </div>
          )}
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold">{editBranch ? "Edit Branch" : "Add New Branch"}</div>
            {editBranch && (
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            )}
          </div>

          <form onSubmit={editBranch ? handleSaveEdit : onAdd} className="space-y-3">
            <div>
              <label className="text-sm font-bold">Branch Code (ID)</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="e.g., BR-004"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                disabled={!!editBranch}
              />
            </div>

            <div>
              <label className="text-sm font-bold">Branch Name</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
                placeholder="e.g., Colombo Branch"
                value={form.branchName}
                onChange={(e) => setForm({ ...form, branchName: e.target.value })}
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
                value={form.managerId}
                onChange={(e) => setForm({ ...form, managerId: e.target.value })}
              >
                <option value="">Select Manager</option>
                {managers.map((m) => {
                  const managerId = m.userId || m.user_id || m.id;
                  const managerName = m.fullName || m.full_name;
                  return (
                    <option key={managerId} value={managerId}>
                      {managerName}
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
                {filtered.map((b) => {
                  const branchId = getBranchId(b);
                  const branchName = getBranchName(b);
                  const managerName = b.managerName || b.manager_name || b.manager || "-";
                  return (
                    <tr key={branchId} className="border-t hover:bg-slate-50">
                      <td className="p-3 font-mono text-xs">{branchId}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                            <MapPin size={18} />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{branchName}</span>
                            <span className="text-xs text-gray-500">{b.address}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">{b.address}</td>
                      <td className="p-3 text-sm">{managerName}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${isActive(b) ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                        >
                          {getBranchStatus(b)}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          ref={(el) => (dropdownButtonRefs.current[branchId] = el)}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(branchId);
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
          className="fixed w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-[200] py-1"
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleViewBranch(branches.find(br => getBranchId(br) === activeDropdown))}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Eye size={14} /> View Details
          </button>
          <button
            onClick={() => handleEditBranch(branches.find(br => getBranchId(br) === activeDropdown))}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Edit size={14} /> Edit Branch
          </button>
          <button
            onClick={() => handleToggleStatus(activeDropdown)}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <Power size={14} /> {isActive(branches.find(br => getBranchId(br) === activeDropdown)) ? "Deactivate" : "Activate"}
          </button>
          <div className="h-px bg-gray-100 my-1"></div>
          <button
            onClick={() => handleDeleteBranch(activeDropdown)}
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
              <h2 className="text-2xl font-extrabold">{getBranchName(selectedBranch)}</h2>
              <button
                onClick={() => {
                  setSelectedBranch(null);
                  setBranchUsers([]);
                }}
                className="text-slate-500 hover:text-slate-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-bold text-slate-600 mb-1">Branch ID</div>
                  <div className="text-lg font-mono">{getBranchId(selectedBranch)}</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-600 mb-1">Location</div>
                  <div className="text-lg">{selectedBranch.address}</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-slate-600 mb-2">Branch Manager</div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  {selectedBranch.managerName || selectedBranch.manager_name || selectedBranch.manager ? (
                    <div>
                      <div className="font-bold text-blue-900">{selectedBranch.managerName || selectedBranch.manager_name || selectedBranch.manager}</div>
                      <div className="text-sm text-blue-700">Assigned Manager</div>
                    </div>
                  ) : (
                    <div className="text-slate-500">No manager assigned</div>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-slate-600 mb-2">Users ({branchUsers.length})</div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {branchUsers.length > 0 ? (
                    branchUsers.map(user => {
                      const userId = user.userId || user.user_id || user.id;
                      const userName = user.fullName || user.full_name;
                      return (
                        <div key={userId} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <div className="font-bold text-sm">{userName}</div>
                          <div className="text-xs text-slate-600">{user.role} • @{user.username}</div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-slate-500 text-sm p-3">No users assigned to this branch</div>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-slate-600 mb-2">Status</div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${isActive(selectedBranch) ? "bg-brand-success" : "bg-slate-500"}`}>
                  {getBranchStatus(selectedBranch)}
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
