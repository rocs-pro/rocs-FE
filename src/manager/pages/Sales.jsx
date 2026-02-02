import { useEffect, useState } from "react";
import TopSellingTable from "../components/TopSellingTable";
import ChartBox from "../components/ChartBox";
import { getSalesData, getPendingGrns } from "../../services/managerService";
import Badge from "../components/Badge";

export default function Sales() {
  const [salesData, setSalesData] = useState([]);
  const [grns, setGrns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [salesResponse, grnsResponse] = await Promise.all([
          getSalesData("weekly"),
          getPendingGrns(),
        ]);

        setSalesData(salesResponse || []);
        setGrns(grnsResponse || []);
      } catch (err) {
        console.error("Error fetching sales data:", err);
        setError("Failed to load sales data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-extrabold">Sales</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Sales</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartBox title="Weekly Sales Performance" data={salesData} />
        </div>

        <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
          <div className="font-bold mb-3">GRN Requests</div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-sm text-brand-muted">Loading GRNs...</div>
            ) : grns.length === 0 ? (
              <div className="text-sm text-brand-muted">No pending GRNs</div>
            ) : (
              grns.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                >
                  <div>
                    <div className="font-bold">{g.id}</div>
                    <div className="text-xs text-brand-muted">{g.supplier}</div>
                  </div>

                  <Badge label={g.eta === "Today" ? "Warning" : "Success"} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <TopSellingTable />
    </div>
  );
}
