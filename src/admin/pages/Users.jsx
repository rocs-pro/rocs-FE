import { useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { branches, seedActivity, seedUsers } from "../data/mockData";
import { addActivity, ensureAdminSeed, getUsers, setUsers } from "../../shared/storage";
import { X, Eye, MoreVertical, Edit, Trash2, Power, User } from "lucide-react";

const statusBadge = (status) =>
  status === "Active" ? "bg-brand-success" : "bg-slate-500";

export default function Users() {
  const [users, setUsersState] = useState([]);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Cashier");
  const [branch, setBranch] = useState("Colombo Main");
  const [q, setQ] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
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
          left: rect.left + window.scrollX - 120
        });
      }
      setActiveDropdown(id);
    }
  };

  useEffect(() => {
    ensureAdminSeed({ seedUsers, seedActivity, seedBranches: branches });
    setUsersState(getUsers());
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter((u) =>
      [u.id, u.fullName, u.username, u.email, u.role, u.branch, u.status]
        .join(" ")
        .toLowerCase()
        .includes(s)
    );
  }, [users, q]);

  function resetForm() {
    setFullName("");
    setUsername("");
    setEmail("");
    setRole("Cashier");
    setBranch("Colombo Main");
    setEditUser(null);
  }

  function handleEditUser(user) {
    setEditUser(user);
    setFullName(user.fullName);
    setUsername(user.username);
    setEmail(user.email);
    setRole(user.role);
    setBranch(user.branch);
    setActiveDropdown(null);
  }

  function handleSaveEdit(e) {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return alert("Full name and email are required");
    const next = users.map((u) =>
      u.id === editUser.id
        ? { ...u, fullName: fullName.trim(), email: email.trim(), role, branch }
        : u
    );
    setUsers(next);
    setUsersState(next);
    addActivity({
      time: new Date().toISOString().slice(0, 19).replace("T", " "),
      actor: "admin",
      type: "User",
      action: `Updated user '${editUser.username}'`,
      severity: "Info",
    });
    resetForm();
  }

  function handleDeleteUser(userId) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const user = users.find((u) => u.id === userId);
      const next = users.filter((u) => u.id !== userId);
      setUsers(next);
      setUsersState(next);
      addActivity({
        time: new Date().toISOString().slice(0, 19).replace("T", " "),
        actor: "admin",
        type: "User",
        action: `Deleted user '${user.username}'`,
        severity: "Warning",
      });
      setActiveDropdown(null);
    }
  }

  function onRegister(e) {
    e.preventDefault();
    const fn = fullName.trim();
    const un = username.trim();
    const em = email.trim();

    if (!fn || !un || !em) {
      alert("Full name, username and email are required.");
      return;
    }

    // basic unique username check
    if (users.some((u) => u.username.toLowerCase() === un.toLowerCase())) {
      alert("Username already exists. Please choose another.");
      return;
    }

    const newUser = {
      id: `U-${String(Date.now()).slice(-6)}`,
      fullName: fn,
      username: un,
      email: em,
      role,
      branch,
      status: "Inactive", // default
      createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
    };

    const next = [newUser, ...users];
    setUsers(next);
    setUsersState(next);

    addActivity({
      time: newUser.createdAt,
      actor: "admin",
      type: "User",
      action: `Registered user '${newUser.username}' (default: Inactive)`,
      severity: "Info",
    });

    resetForm();
  }

  function toggleStatus(userId) {
    const next = users.map((u) => {
      if (u.id !== userId) return u;
      const newStatus = u.status === "Active" ? "Inactive" : "Active";
      return { ...u, status: newStatus };
    });

    const changed = next.find((u) => u.id === userId);
    setUsers(next);
    setUsersState(next);

    addActivity({
      time: new Date().toISOString().slice(0, 19).replace("T", " "),
      actor: "admin",
      type: "User",
      action: `Set user '${changed.username}' status to ${changed.status}`,
      severity: "Warning",
    });
  }

  return (
    <div className="space-y-4" onClick={() => setActiveDropdown(null)}>
      <div>
        <h1 className="text-xl font-extrabold">User Registration</h1>
        <p className="text-sm text-brand-muted">
          New users are created as <span className="font-bold">Inactive</span>. Admin must activate a user before they can access the system.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form */}
        <div className={`lg:col-span-1 bg-white border rounded-2xl shadow-sm p-5 transition-all duration-300 ${editUser ? 'border-blue-400 ring-2 ring-blue-100' : 'border-brand-border'}`}>
          {editUser && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <Edit size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Editing: {editUser.fullName}</span>
            </div>
          )}
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold">{editUser ? "Edit User" : "Register New User"}</div>
            {editUser && (
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <form onSubmit={editUser ? handleSaveEdit : onRegister} className="space-y-3">
            <div>
              <label className="text-sm font-bold">Full Name</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g., Nimal Perera"
              />
            </div>

            <div>
              <label className="text-sm font-bold">Username</label>
              <input
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary disabled:bg-gray-100 disabled:text-gray-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., nimal"
                disabled={!!editUser}
              />
            </div>

            <div>
              <label className="text-sm font-bold">Email</label>
              <input
                type="email"
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., nimal@smartretailpro.lk"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-bold">Role</label>
                <select
                  className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border bg-white"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option>Cashier</option>
                  <option>Manager</option>
                  <option>Store Keeper</option>
                  <option>Accountant</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-bold">Branch</label>
                <select
                  className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border bg-white"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                >
                  {branches.map((b) => (
                    <option key={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold transition"
            >
              {editUser ? "Save Changes" : "Register User (Inactive)"}
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 bg-white border border-brand-border rounded-2xl shadow-sm overflow-visible">
          <div className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="font-bold">All Users</div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search users..."
              className="w-full sm:w-80 px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
            />
          </div>

          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Branch</th>
                  <th className="text-center p-3">Status</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-slate-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                          <User size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{u.fullName}</span>
                          <span className="text-xs text-gray-500">@{u.username} • {u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3">{u.branch}</td>
                    <td className="p-3 text-center">
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                        u.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-right relative">
                      <button
                        ref={(el) => (dropdownButtonRefs.current[u.id] = el)}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(u.id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-brand-muted">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dropdown Portal */}
      {activeDropdown &&
        createPortal(
          <div
            className="fixed bg-white border border-gray-200 rounded-xl shadow-lg py-1 min-w-[160px] z-[200]"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                const user = users.find((u) => u.id === activeDropdown);
                setSelectedUser(user);
                setActiveDropdown(null);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Eye size={16} className="text-gray-500" />
              View Details
            </button>
            <button
              onClick={() => handleEditUser(users.find((u) => u.id === activeDropdown))}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Edit size={16} className="text-blue-500" />
              Edit User
            </button>
            <button
              onClick={() => {
                toggleStatus(activeDropdown);
                setActiveDropdown(null);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <Power size={16} className="text-orange-500" />
              {users.find((u) => u.id === activeDropdown)?.status === "Active"
                ? "Deactivate"
                : "Activate"}
            </button>
            <button
              onClick={() => handleDeleteUser(activeDropdown)}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
            >
              <Trash2 size={16} />
              Delete User
            </button>
          </div>,
          document.body
        )}

      {/* View Details Modal */}
      {selectedUser &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[300]">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">User Details</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
                    <User size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{selectedUser.fullName}</div>
                    <div className="text-sm text-gray-500">@{selectedUser.username}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <div className="text-gray-500 text-xs">Email</div>
                    <div className="font-medium">{selectedUser.email}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <div className="text-gray-500 text-xs">Role</div>
                    <div className="font-medium">{selectedUser.role}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <div className="text-gray-500 text-xs">Branch</div>
                    <div className="font-medium">{selectedUser.branch}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <div className="text-gray-500 text-xs">Status</div>
                    <div className={`font-medium ${
                      selectedUser.status === "Active" ? "text-green-600" : "text-red-600"
                    }`}>
                      {selectedUser.status}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full mt-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-medium transition"
              >
                Close
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
