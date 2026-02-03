import React from "react";

export function SalesTrendChart({ data, big, colorful }) {
  const sizeClass = big ? "p-8 min-h-[180px]" : "p-4";
  const colorClass = colorful ? "bg-gradient-to-br from-blue-400 via-blue-200 to-blue-100" : "bg-white";
  return (
    <div className={`rounded-2xl shadow-lg ${sizeClass} ${colorClass}`}>
      <div className="font-bold mb-4 text-xl text-black">Sales Trend</div>
      <div className="flex items-end gap-2 h-32">
        {data && data.length > 0 ? data.map((v, i) => (
          <div key={i} className="bg-blue-600 w-8 rounded" style={{ height: `${v / 2}px` }} />
        )) : <span className="text-black">No data</span>}
      </div>
      <div className="text-xs text-gray-700 mt-4">Last 7 days</div>
    </div>
  );
}

export function PaymentMethodsChart({ methods, big, colorful }) {
  const sizeClass = big ? "p-8 min-h-[180px]" : "p-4";
  const colorClass = colorful ? "bg-gradient-to-br from-green-400 via-green-200 to-green-100" : "bg-white";
  const total = methods && methods.length > 0 ? methods.reduce((sum, m) => sum + m.value, 0) : 1;
  return (
    <div className={`rounded-2xl shadow-lg ${sizeClass} ${colorClass}`}>
      <div className="font-bold mb-4 text-xl text-black">Payment Methods</div>
      <ul className="space-y-2">
        {methods && methods.length > 0 ? methods.map((m) => (
          <li key={m.method} className="text-lg font-semibold text-black">
            <span>{m.method}</span>: {m.value} ({Math.round((m.value/total)*100)}%)
          </li>
        )) : <li className="text-black">No data</li>}
      </ul>
    </div>
  );
}
