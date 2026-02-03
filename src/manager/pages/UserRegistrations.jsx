import { useEffect, useState } from "react";
import {
  getUserRegistrations,
  updateRegistrationStatus,
  getRegisteredUsers,
  updateUserRole,
  updateUserActiveStatus,
} from "../../services/managerService";

const ROLE_OPTIONS = [
  "ADMIN",
  "BRANCH_MANAGER",
  "STORE_KEEPER",
  "CASHIER",
  "SUPERVISOR",
];

export default function UserRegistrations() {
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [pendingRoles, setPendingRoles] = useState({});
  const [userRoles, setUserRoles] = useState({});
  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchPending();
    fetchUsers();
  }, []);

  const fetchPending = async () => {
    try {
      setLoadingPending(true);
      const data = await getUserRegistrations("PENDING");
      const rows = data || [];
      setPending(rows);
      const roleMap = {};
      rows.forEach((r) => {
        const id = r.id ?? r.userId ?? r._id;
        roleMap[id] = r.role || "CASHIER";
      });
      setPendingRoles(roleMap);
      setError(null);
    } catch (err) {
      console.error("Error fetching pending registrations:", err);
      setError("Failed to load user registrations");
    } finally {
      setLoadingPending(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await getRegisteredUsers();
      const rows = data || [];
      setUsers(rows);
      const roleMap = {};
      rows.forEach((u) => {
        const id = u.id ?? u.userId ?? u._id;
        roleMap[id] = u.role || u.userRole || "CASHIER";
      });
      setUserRoles(roleMap);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load registered users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleApprove = async (row) => {
    const id = row.id ?? row.userId ?? row._id;
    const role = pendingRoles[id] || row.role || "CASHIER";
    try {
      setUpdating(id);
      await updateRegistrationStatus(id, "APPROVED", role);
      setPending((prev) => prev.filter((r) => (r.id ?? r.userId ?? r._id) !== id));
    } catch (err) {
      console.error("Error approving registration:", err);
      alert("Failed to approve registration.");
    } finally {
      setUpdating(null);
    }
  };

  const handleReject = async (row) => {
    const id = row.id ?? row.userId ?? row._id;
    try {
      setUpdating(id);
      await updateRegistrationStatus(id, "REJECTED");
      setPending((prev) => prev.filter((r) => (r.id ?? r.userId ?? r._id) !== id));
    } catch (err) {
      console.error("Error rejecting registration:", err);
      alert("Failed to reject registration.");
    } finally {
      setUpdating(null);
    }
  };

  const handleRoleChange = async (user) => {
    const id = user.id ?? user.userId ?? user._id;
    const nextRole = userRoles[id];
    try {
      setUpdating(id);
      await updateUserRole(id, nextRole);
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update user role.");
    } finally {
      setUpdating(null);
    }
  };

  const handleStatusToggle = async (user) => {
    const id = user.id ?? user.userId ?? user._id;
    const nextActive = !(user.isActive ?? user.active ?? true);
    try {
      setUpdating(id);
      await updateUserActiveStatus(id, nextActive);
      setUsers((prev) =>
        prev.map((u) =>
          (u.id ?? u.userId ?? u._id) === id
            ? { ...u, isActive: nextActive, active: nextActive }
            : u
        )
      );
    } catch (err) {
      console.error("Error updating active status:", err);
      alert("Failed to update active status.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-extrabold">User Registration Approvals</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 font-bold">Pending Registrations</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Username</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Assign Role</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingPending ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-brand-muted">
                    Loading pending registrations...
                  </td>
                </tr>
              ) : pending.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-brand-muted" colSpan={5}>
                    No pending registrations
                  </td>
                </tr>
              ) : (
                pending.map((r) => {
                  const id = r.id ?? r.userId ?? r._id;
                  const assignedRole = pendingRoles[id] || r.role || "CASHIER";
                  return (
                    <tr key={id} className="border-t hover:bg-slate-50">
                      <td className="p-3 font-semibold">{r.name || r.fullName || "-"}</td>
                      <td className="p-3">{r.username || r.userName || "-"}</td>
                      <td className="p-3">{r.email || "-"}</td>
                      <td className="p-3">
                        <select
                          value={assignedRole}
                          onChange={(e) =>
                            setPendingRoles((prev) => ({ ...prev, [id]: e.target.value }))
                          }
                          className="px-2 py-1 rounded border border-slate-200 bg-white"
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3 flex items-center gap-2">
                        <button
                          type="button"
                          disabled={updating === id}
                          onClick={() => handleApprove(r)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700 disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={updating === id}
                          onClick={() => handleReject(r)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 font-bold">Registered Users</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Username</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Active</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingUsers ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-brand-muted">
                    Loading registered users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td className="p-6 text-center text-brand-muted" colSpan={6}>
                    No registered users
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const id = u.id ?? u.userId ?? u._id;
                  const roleValue = userRoles[id] || u.role || u.userRole || "CASHIER";
                  const isActive = u.isActive ?? u.active ?? true;
                  return (
                    <tr key={id} className="border-t hover:bg-slate-50">
                      <td className="p-3 font-semibold">{u.name || u.fullName || "-"}</td>
                      <td className="p-3">{u.username || u.userName || "-"}</td>
                      <td className="p-3">{u.email || "-"}</td>
                      <td className="p-3">
                        <select
                          value={roleValue}
                          onChange={(e) =>
                            setUserRoles((prev) => ({ ...prev, [id]: e.target.value }))
                          }
                          className="px-2 py-1 rounded border border-slate-200 bg-white"
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          disabled={updating === id}
                          onClick={() => handleStatusToggle(u)}
                          className={`px-3 py-1 rounded text-xs font-bold ${
                            isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          disabled={updating === id}
                          onClick={() => handleRoleChange(u)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700 disabled:opacity-60"
                        >
                          Save Role
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
