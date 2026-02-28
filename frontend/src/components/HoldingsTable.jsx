export default function HoldingsTable({ positions }) {
  if (!positions.length) return null;

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Holdings</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-slate-700">
              <th className="text-left py-2 pr-4">Ticker</th>
              <th className="text-left py-2 pr-4">Name</th>
              <th className="text-right py-2 pr-4">Qty</th>
              <th className="text-right py-2 pr-4">Value</th>
              <th className="text-left py-2">Sector</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((p) => (
              <tr key={p.ticker} className="border-b border-slate-700/50">
                <td className="py-2 pr-4 font-medium text-blue-400">{p.ticker}</td>
                <td className="py-2 pr-4 text-slate-300">{p.name}</td>
                <td className="py-2 pr-4 text-right">{p.quantity}</td>
                <td className="py-2 pr-4 text-right">${p.market_value.toLocaleString()}</td>
                <td className="py-2 text-slate-400">{p.sector || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
