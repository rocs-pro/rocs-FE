import { useEffect, useState } from "react";
import {
  getUserRegistrations,
  updateRegistrationStatus,
  getStaffSummary,
  updateUserRole,
  updateUserActiveStatus,
} from "../../services/managerService";

const ROLE_OPTIONS = [
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
      setError(null);

      console.log("Fetching pending registrations...");
      const data = await getUserRegistrations("PENDING");
      console.log("Raw Pending API Response:", data);

      if (!Array.isArray(data)) {
        console.warn("API response is not an array:", data);
        setPending([]);
        return;
      }

      const rows = data.map(r => ({
        ...r,
        // Robust fallback: if backend field is missing, check alternative or default
        name: r.requestedBy || r.reference || "Unknown",
        username: r.username || (r.referenceNo ? r.referenceNo.replace("USER-", "") : "-"),
        email: r.email || "No Email",
        time: r.time || "Recently"
      }));

      setPending(rows);

      // Initialize default roles
      const roleMap = {};
      rows.forEach((r) => {
        roleMap[r.id] = r.role || "CASHIER";
      });
      setPendingRoles(roleMap);

    } catch (err) {
      console.error("Error fetching pending registrations:", err);
      setError("Failed to connect to server. Ensure Backend is running.");
    } finally {
      setLoadingPending(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const data = await getStaffSummary();

      const rows = (data || []).map(u => ({
        id: u.userId,
        name: u.name,
        username: "-",
        email: "-",
        role: u.role,
        lastLogin: u.lastLogin,
        isActive: u.status === "Active" || u.status === "Online",
        statusRaw: u.status
      })).filter(u => u.role !== "ADMIN");

      setUsers(rows);

      const roleMap = {};
      rows.forEach((u) => {
        roleMap[u.id] = u.role || "CASHIER";
      });
      setUserRoles(roleMap);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleApprove = async (row) => {
    const id = row.id;
    const role = pendingRoles[id] || "CASHIER";
    try {
      setUpdating(id);
      await updateRegistrationStatus(id, "APPROVED", role);

      // Remove from list immediately
      setPending((prev) => prev.filter((r) => r.id !== id));

      // Refresh users list after short delay for consistent read
      setTimeout(fetchUsers, 500);

    } catch (err) {
      console.error("Error approving registration:", err);
      alert("Failed to approve. Check console for details.");
    } finally {
      setUpdating(null);
    }
  };

  const handleReject = async (row) => {
    const id = row.id;
    try {
      setUpdating(id);
      await updateRegistrationStatus(id, "REJECTED");
      setPending((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error rejecting registration:", err);
      alert("Failed to reject.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-slate-800">User Management</h1>
        <button
          onClick={() => { fetchPending(); fetchUsers(); }}
          className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded font-bold transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
          <span className="font-bold relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* PENDING TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <span className="font-bold text-slate-700">Pending Approvals</span>
          {pending.length > 0 && (
            <span className="bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm border border-amber-200">
              {pending.length} Waiting
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Name</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Username</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Email</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Assign Role</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingPending ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
                      <span>Syncing requests...</span>
                    </div>
                  </td>
                </tr>
              ) : pending.length === 0 ? (
                <tr>
                  <td className="p-8 text-center text-slate-400" colSpan={5}>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg opacity-50">✓</span>
                      <span>No pending registrations found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                pending.map((r) => {
                  const id = r.id;
                  const assignedRole = pendingRoles[id] || "CASHIER";
                  const isProcessing = updating === id;

                  return (
                    <tr key={id} className={`group hover:bg-slate-50 transition-colors ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}>
                      <td className="p-4 font-semibold text-slate-700">
                        {r.name}
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5 max-w-[150px] truncate">{r.reference}</div>
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-600">{r.username}</td>
                      <td className="p-4 text-slate-600">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-xs font-medium text-slate-600 border border-slate-200 max-w-[180px] break-all">
                          {r.email}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={assignedRole}
                          onChange={(e) =>
                            setPendingRoles((prev) => ({ ...prev, [id]: e.target.value }))
                          }
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand cursor-pointer hover:border-slate-300 transition-colors"
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(r)}
                            disabled={isProcessing}
                            className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(r)}
                            disabled={isProcessing}
                            className="px-3 py-1.5 bg-white border border-slate-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 hover:border-red-200 transition-all active:scale-95 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REGISTERED USERS TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 font-bold text-slate-700">
          Staff Directory
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Name</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Role</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Last Login</th>
                <th className="text-left p-4 font-semibold uppercase text-xs tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingUsers ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">Loading staff...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td className="p-8 text-center text-slate-400" colSpan={4}>No staff found</td>
                </tr>
              ) : (
                users.map((u) => {
                  const id = u.id;
                  const roleValue = u.role || "CASHIER";
                  const isActive = u.isActive;
                  return (
                    <tr key={id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-700">{u.name}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-bold border border-slate-200 text-slate-600">
                          {roleValue}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 font-mono text-xs">
                        {u.lastLogin || "Never"}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide border ${isActive
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}>
                          {u.statusRaw || "Inactive"}
                        </span>
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
