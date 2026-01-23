// Generic table component (optional). Use if you want reusable tables later.

export default function DataTable({ title, columns, rows, rowKey }) {
  return (
    <div className="bg-white border border-brand-border rounded-2xl shadow-sm overflow-hidden">
      {title && <div className="p-5 font-bold">{title}</div>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="text-left p-3">
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={rowKey ? rowKey(r) : i} className="border-t hover:bg-slate-50">
                {columns.map((c) => (
                  <td key={c.key} className="p-3">
                    {c.render ? c.render(r) : r[c.key]}
                  </td>
                ))}
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td className="p-5 text-brand-muted" colSpan={columns.length}>
                  No data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
