import { useEffect, useMemo, useState } from "react";
import { branches, seedActivity, seedUsers } from "../data/mockData";
import { addActivity, ensureAdminSeed, getUsers, setUsers } from "../../shared/storage";

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
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold">User Registration</h1>
        <p className="text-sm text-brand-muted">
          New users are created as <span className="font-bold">Inactive</span>. Admin must activate a user before they can access the system.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form */}
        <div className="lg:col-span-1 bg-white border border-brand-border rounded-2xl shadow-sm p-5">
          <div className="font-bold mb-3">Register New User</div>
          <form onSubmit={onRegister} className="space-y-3">
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
                className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g., nimal"
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
              Register User (Inactive)
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="font-bold">All Users</div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search users..."
              className="w-full sm:w-80 px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Branch</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-t hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-bold">{u.fullName}</div>
                      <div className="text-xs text-brand-muted">
                        @{u.username} • {u.email}
                      </div>
                    </td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3">{u.branch}</td>
                    <td className="p-3">
                      <span className={`text-xs px-3 py-1 rounded-full text-white font-bold ${statusBadge(u.status)}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => toggleStatus(u.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition ${
                          u.status === "Active"
                            ? "bg-white border-brand-border hover:bg-slate-50"
                            : "bg-brand-primary text-white border-brand-primary hover:bg-brand-secondary"
                        }`}
                      >
                        {u.status === "Active" ? "Deactivate" : "Activate"}
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
    </div>
  );
}
