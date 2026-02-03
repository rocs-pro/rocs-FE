import React from "react";

export default function BranchSnapshot({ branches, big, colorful }) {
  const sizeClass = big ? "p-8 min-h-[180px]" : "p-4";
  const colorClass = colorful ? "bg-gradient-to-br from-yellow-400 via-yellow-200 to-yellow-100 text-brand-deep" : "bg-white";
  return (
    <div className={`rounded-2xl shadow-lg ${sizeClass} ${colorClass}`}>
      <div className="font-bold mb-4 text-xl">Branch Snapshot</div>
      <table className="w-full text-lg">
        <thead>
          <tr className="text-brand-muted text-base">
            <th className="text-left">Branch</th>
            <th className="text-right">Sales</th>
            <th className="text-center">Terminals</th>
            <th className="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {branches.map((b, i) => (
            <tr key={b.name} className={i === 0 ? "font-bold text-green-700" : i === branches.length-1 ? "text-red-500" : ""}>
              <td>{b.name}</td>
              <td className="text-right">LKR {b.sales ? b.sales.toLocaleString() : "-"}</td>
              <td className="text-center">{b.terminals || "-"}</td>
              <td className="text-center">{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-xs text-brand-muted mt-4">Top to Worst Branch, Active Terminals</div>
    </div>
  );
}
