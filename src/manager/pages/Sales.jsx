import TopSellingTable from "../components/TopSellingTable";
import ChartBox from "../components/ChartBox";
import { managerWeeklySales, pendingGrns } from "../data/managerMockData";
import Badge from "../components/Badge";

export default function Sales() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Sales</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartBox title="Weekly Sales Performance" data={managerWeeklySales} />
        </div>

        <div className="bg-white border border-brand-border rounded-2xl shadow-sm p-5">
          <div className="font-bold mb-3">GRN Requests</div>

          <div className="space-y-3">
            {pendingGrns.map((g) => (
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
            ))}
          </div>
        </div>
      </div>

      <TopSellingTable />
    </div>
  );
}
