import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBalanceSummary } from "../services/api";
import type { ProjectionResult } from "../services/api";

const tools = [
  {
    title: "Portfolio Balancer",
    description: "View your holdings breakdown by sector and get buy suggestions to stay on target.",
    path: "/portfolio",
  },
  {
    title: "Contribution Allocator",
    description: "Calculate how to split your income across Traditional, Roth, Brokerage, and HYSA.",
    path: "/contributions",
  },
  {
    title: "Account Balances",
    description: "Enter Fidelity and Ally balances to track your full portfolio.",
    path: "/balances",
  },
];

const fmt = (n: number) => "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

export default function HomePage() {
  const [summary, setSummary] = useState<ProjectionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBalanceSummary()
      .then(setSummary)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">PortfolioBalancer</h1>
        <p className="text-slate-400 text-sm mt-1">Personal finance tools</p>
      </header>

      {/* Dashboard */}
      {loading ? (
        <p className="text-slate-400 text-sm mb-8">Loading portfolio summary...</p>
      ) : summary ? (
        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <div className="mb-6">
            <p className="text-slate-400 text-sm">Total Portfolio</p>
            <p className="text-3xl font-bold text-white">{fmt(summary.current_total)}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-slate-400 text-xs">Schwab</p>
              <p className="text-white font-semibold">{fmt(summary.schwab_total)}</p>
              <p className="text-slate-500 text-xs">{summary.schwab_cagr}% CAGR</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Fidelity</p>
              <p className="text-white font-semibold">{fmt(summary.fidelity_total)}</p>
              <p className="text-slate-500 text-xs">10% CAGR (S&P 500)</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Ally HYSA</p>
              <p className="text-white font-semibold">{fmt(summary.ally_total)}</p>
              <p className="text-slate-500 text-xs">3% APY</p>
            </div>
          </div>

          {summary.projections.length > 0 && (
            <div>
              <p className="text-slate-400 text-sm font-medium mb-3">Projected Growth</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700">
                      <th className="text-left py-2 pr-4">Years</th>
                      <th className="text-right py-2 pr-4">Schwab</th>
                      <th className="text-right py-2 pr-4">Fidelity</th>
                      <th className="text-right py-2 pr-4">Ally</th>
                      <th className="text-right py-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.projections.map((p) => (
                      <tr key={p.years} className="border-b border-slate-700/50">
                        <td className="py-2 pr-4 text-slate-300">{p.years}yr</td>
                        <td className="py-2 pr-4 text-right">{fmt(p.schwab)}</td>
                        <td className="py-2 pr-4 text-right">{fmt(p.fidelity)}</td>
                        <td className="py-2 pr-4 text-right">{fmt(p.ally)}</td>
                        <td className="py-2 text-right font-semibold text-green-400">{fmt(p.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className="bg-slate-800 rounded-xl p-6 hover:bg-slate-700 transition-colors border border-slate-700 hover:border-slate-500"
          >
            <h2 className="text-lg font-semibold mb-2">{tool.title}</h2>
            <p className="text-slate-400 text-sm">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
