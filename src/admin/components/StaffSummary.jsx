import { useEffect, useMemo, useState } from "react";
import { branches, seedActivity, seedUsers } from "../data/mockData";
import { ensureAdminSeed, getActivity } from "../../shared/storage";

export default function StaffSummary() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    ensureAdminSeed({ seedUsers, seedActivity, seedBranches: branches });
    setRows(getActivity());
  }, []);

  const { totalUsers, failedLogins } = useMemo(() => {
    const logins = rows.filter((e) => e.type === "Login");
    const actors = new Set(logins.map((e) => (e.actor || "").toLowerCase()).filter(Boolean));
    const failed = logins.filter((e) => (e.action || "").toLowerCase().includes("fail")).length;
    return { totalUsers: actors.size, failedLogins: failed };
  }, [rows]);

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
      <div className="font-bold mb-3">Staff Summary</div>
      <div className="text-sm text-brand-muted">
        Users with login activity: <span className="font-bold text-brand-text">{totalUsers}</span>
      </div>
      <div className="text-sm text-brand-muted">
        Failed login attempts: <span className="font-bold text-brand-text">{failedLogins}</span>
      </div>
    </div>
  );
}
