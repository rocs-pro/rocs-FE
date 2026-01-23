import { useEffect, useMemo, useState } from "react";
import { branches, seedActivity, seedUsers } from "../data/mockData";
import { addActivity, ensureAdminSeed, getUsers, setUsers } from "../../shared/storage";

function generateTempPassword() {
  // UI demo generator. In real ERP, generate on the server.
  const part = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `Tmp@${part}${Math.floor(Math.random() * 90 + 10)}`;
}

export default function PasswordReset() {
  const [users, setUsersState] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  useEffect(() => {
    ensureAdminSeed({ seedUsers, seedActivity, seedBranches: branches });
    const u = getUsers();
    setUsersState(u);
    if (u.length) setSelectedId(u[0].id);
  }, []);

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedId),
    [users, selectedId]
  );

  function refresh() {
    const u = getUsers();
    setUsersState(u);
    if (u.length && !u.find((x) => x.id === selectedId)) setSelectedId(u[0].id);
  }

  function onGenerate() {
    setTempPassword(generateTempPassword());
  }

  function onReset(e) {
    e.preventDefault();
    if (!selectedUser) {
      alert("Please select a user.");
      return;
    }
    if (!tempPassword.trim()) {
      alert("Please generate or enter a temporary password.");
      return;
    }

    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    const next = users.map((u) => {
      if (u.id !== selectedId) return u;
      return {
        ...u,
        tempPassword: tempPassword.trim(),
        mustChangePassword: true,
        passwordResetAt: now,
      };
    });

    setUsers(next);
    setUsersState(next);

    addActivity({
      time: now,
      actor: "admin",
      type: "Security",
      action: `Password reset issued for user '${selectedUser.username}' (temp password set)`,
      severity: "Warning",
    });

    alert(
      `Temporary password set for '${selectedUser.username}'.\n\nTemp password: ${tempPassword.trim()}\n\n(Connect to backend later for real reset + email/SMS.)`
    );
    setTempPassword("");
    refresh();
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold">Password Reset</h1>
        <p className="text-sm text-brand-muted">
          Select a user and issue a temporary password. User should change it on next login.
        </p>
      </div>

      <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5 max-w-2xl">
        <form onSubmit={onReset} className="space-y-4">
          <div>
            <label className="text-sm font-bold">Select User</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border bg-white"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} (@{u.username}) — {u.status}
                </option>
              ))}
            </select>

            {selectedUser && (
              <div className="mt-2 text-xs text-brand-muted">
                Role: <span className="font-bold">{selectedUser.role}</span> • Branch:{" "}
                <span className="font-bold">{selectedUser.branch}</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-bold">Temporary Password</label>
            <div className="mt-1 flex gap-2">
              <input
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                placeholder="Click Generate or type one"
                className="flex-1 px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
              />
              <button
                type="button"
                onClick={onGenerate}
                className="px-4 py-2 rounded-xl bg-slate-100 border border-brand-border hover:bg-slate-200 transition text-sm font-bold"
              >
                Generate
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold transition"
          >
            Issue Password Reset
          </button>
        </form>
      </div>
    </div>
  );
}
