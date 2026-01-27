import { useEffect, useState } from "react";
import Badge from "../components/Badge";
import { getStaffSummary } from "../../services/managerService";

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStaffSummary();
        setStaff(data || []);
      } catch (err) {
        console.error("Error fetching staff:", err);
        setError("Failed to load staff data");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Staff</h1>
      <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 font-bold">Staff Activity Summary</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Last Login</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-brand-muted">
                    Loading staff data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-brand-muted">
                    No staff members
                  </td>
                </tr>
              ) : (
                staff.map((s) => (
                  <tr key={s.name} className="border-t hover:bg-slate-50">
                    <td className="p-3 font-bold">{s.name}</td>
                    <td className="p-3">{s.role}</td>
                    <td className="p-3 text-brand-muted">{s.lastLogin}</td>
                    <td className="p-3"><Badge label={s.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
