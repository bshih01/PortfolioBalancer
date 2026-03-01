import { useState } from "react";
import { getSuggestions } from "../services/api";
import type { Suggestion } from "../services/api";

interface Props {
  account: string;
}

export default function SuggestionsPanel({ account }: Props) {
  const [budget, setBudget] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(budget);
    if (!amount || amount <= 0) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getSuggestions(amount, account);
      setSuggestions(data);
    } catch {
      setError("Failed to get suggestions. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Buy Suggestions</h2>
      <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
        <input
          type="number"
          placeholder="Monthly budget ($)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="bg-slate-700 text-slate-200 px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 flex-1"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "..." : "Suggest"}
        </button>
      </form>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {suggestions && suggestions.length === 0 && (
        <p className="text-slate-400">Portfolio is balanced — no buys needed.</p>
      )}

      {suggestions && suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.map((s, i) => (
            <div key={i} className="flex justify-between items-center bg-slate-700/50 px-4 py-3 rounded-lg">
              <div>
                <span className="font-medium text-blue-400">{s.ticker}</span>
                <span className="text-slate-400 ml-2 text-sm">{s.sector}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-green-400">${s.amount.toFixed(2)}</span>
                <p className="text-xs text-slate-400">{s.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
