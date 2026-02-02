import { useEffect, useState } from "react";
import Badge from "./Badge";
import { getStaffSummary } from "../../services/managerService";

export default function StaffWidget() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const data = await getStaffSummary();
        setStaff(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching staff summary:", err);
        setError("Failed to load staff data");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
      <div className="font-bold mb-3">Staff Activity</div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-sm text-brand-muted">Loading staff data...</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : staff.length === 0 ? (
          <div className="text-sm text-brand-muted">No staff members</div>
        ) : (
          staff.slice(0, 4).map((s) => (
            <div key={s.name} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
              <div>
                <div className="font-bold">{s.name} <span className="text-xs text-brand-muted">({s.role})</span></div>
                <div className="text-xs text-brand-muted">Last login: {s.lastLogin}</div>
              </div>
              <Badge label={s.status} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
