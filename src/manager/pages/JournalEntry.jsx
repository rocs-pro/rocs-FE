import { useState } from "react";

export default function JournalEntry() {
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [lines, setLines] = useState([
    { account: "", dr: "", cr: "" },
    { account: "", dr: "", cr: "" },
  ]);

  function updateLine(idx, key, value) {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, [key]: value } : l)));
  }

  function addLine() {
    setLines((prev) => [...prev, { account: "", dr: "", cr: "" }]);
  }

  function onSubmit(e) {
    e.preventDefault();
    alert("Journal entry saved (UI only). Connect to backend later.");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold">Journal Entry</h1>

      <form onSubmit={onSubmit} className="bg-white border border-brand-border rounded-2xl shadow-sm p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm font-bold">Date</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="YYYY-MM-DD"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-bold">Description</label>
            <input
              className="mt-1 w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Cash sales"
            />
          </div>
        </div>

        <div className="font-bold">Lines</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3">Account</th>
                <th className="text-left p-3">Debit</th>
                <th className="text-left p-3">Credit</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-3">
                    <input
                      className="w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
                      value={l.account}
                      onChange={(e) => updateLine(idx, "account", e.target.value)}
                      placeholder="e.g., Cash"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      className="w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
                      value={l.dr}
                      onChange={(e) => updateLine(idx, "dr", e.target.value)}
                      placeholder="0"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      className="w-full px-3 py-2 rounded-xl border border-brand-border outline-none focus:ring-2 focus:ring-brand-secondary"
                      value={l.cr}
                      onChange={(e) => updateLine(idx, "cr", e.target.value)}
                      placeholder="0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            className="px-4 py-2 rounded-xl border border-brand-border hover:bg-slate-50 font-bold"
            onClick={addLine}
          >
            + Add Line
          </button>

          <button
            type="submit"
            className="flex-1 px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold transition"
          >
            Save Journal Entry
          </button>
        </div>
      </form>
    </div>
  );
}
