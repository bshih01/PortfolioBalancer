import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAccounts, getAllocation, getTargets } from "../services/api";
import type { Account, Allocation, Targets } from "../services/api";
import AccountSelector from "../components/AccountSelector";
import AllocationChart from "../components/AllocationChart";
import TargetComparison from "../components/TargetComparison";
import SuggestionsPanel from "../components/SuggestionsPanel";
import HoldingsTable from "../components/HoldingsTable";
import TargetEditor from "../components/TargetEditor";

export default function PortfolioPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selected, setSelected] = useState("all");
  const [allocation, setAllocation] = useState<Allocation | null>(null);
  const [targets, setTargets] = useState<Targets>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAccounts().then(setAccounts).catch((err) => console.error("Failed to load accounts:", err));
    getTargets().then(setTargets).catch((err) => console.error("Failed to load targets:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAllocation(selected)
      .then(setAllocation)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selected]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-6 max-w-md text-center">
          <h2 className="text-red-400 font-semibold mb-2">Connection Error</h2>
          <p className="text-slate-300 text-sm">{error}</p>
          <p className="text-slate-400 text-xs mt-2">Make sure the backend is running on port 8000 and you've authenticated with Schwab.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-slate-400 hover:text-slate-200 text-sm">&larr; Home</Link>
          <h1 className="text-2xl font-bold">Portfolio Balancer</h1>
        </div>
        <AccountSelector accounts={accounts} selected={selected} onChange={setSelected} />
      </header>

      {loading ? (
        <p className="text-slate-400 text-center py-12">Loading portfolio...</p>
      ) : allocation ? (
        <div className="space-y-6">
          <div className="text-slate-400 text-sm">
            Total Value: <span className="text-white font-semibold text-lg">${allocation.total_value.toLocaleString()}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AllocationChart sectors={allocation.sectors} />
            <TargetComparison sectors={allocation.sectors} targets={targets} />
          </div>

          <TargetEditor targets={targets} onSave={setTargets} />
          <SuggestionsPanel account={selected} />
          <HoldingsTable positions={allocation.positions} />
        </div>
      ) : null}
    </div>
  );
}
