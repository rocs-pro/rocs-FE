import { useEffect, useState } from "react";
import Badge from "./Badge";
import { getPendingGrns } from "../../services/managerService";

export default function PendingGrns() {
  const [grns, setGrns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrns = async () => {
      try {
        setLoading(true);
        const data = await getPendingGrns();
        setGrns(data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching pending GRNs:", err);
        setError("Failed to load GRNs");
      } finally {
        setLoading(false);
      }
    };

    fetchGrns();
  }, []);

  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
      <div className="font-bold mb-3">Pending GRNs</div>
      <div className="space-y-3">
        {loading ? (
          <div className="text-sm text-brand-muted">Loading GRNs...</div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : grns.length === 0 ? (
          <div className="text-sm text-brand-muted">No pending GRNs</div>
        ) : (
          grns.map((g) => (
            <div key={g.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
              <div>
                <div className="font-bold">{g.id}</div>
                <div className="text-xs text-brand-muted">{g.supplier} • {g.items} items</div>
              </div>
              <Badge label={g.eta === "Today" ? "Warning" : "Success"} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
