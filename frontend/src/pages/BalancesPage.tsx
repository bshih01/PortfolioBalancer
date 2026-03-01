import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBalances, saveBalances } from "../services/api";
import type { AccountBalances } from "../services/api";

const DEFAULT_BALANCES: AccountBalances = {
  fidelity_trad_401k: 0,
  fidelity_roth_401k: 0,
  ally_hysa: 0,
};

const formatWithCommas = (num: number) => (num ? num.toLocaleString() : "");
const parseCommaNumber = (value: string) => parseFloat(value.replace(/,/g, "")) || 0;

const FIELDS: { key: keyof AccountBalances; label: string }[] = [
  { key: "fidelity_trad_401k", label: "Fidelity Traditional 401k" },
  { key: "fidelity_roth_401k", label: "Fidelity Roth 401k" },
  { key: "ally_hysa", label: "Ally HYSA" },
];

export default function BalancesPage() {
  const [balances, setBalances] = useState<AccountBalances>(DEFAULT_BALANCES);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getBalances()
      .then((data) => {
        if (data.fidelity_trad_401k || data.fidelity_roth_401k || data.ally_hysa) {
          setBalances(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (key: keyof AccountBalances, value: string) => {
    setBalances((prev) => ({ ...prev, [key]: parseCommaNumber(value) }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await saveBalances(balances);
      setSaved(true);
    } catch {
      setError("Failed to save balances.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <header className="flex items-center gap-4 mb-8">
        <Link to="/" className="text-slate-400 hover:text-slate-200 text-sm">&larr; Home</Link>
        <h1 className="text-2xl font-bold">Account Balances</h1>
      </header>

      <div className="bg-slate-800 rounded-xl p-6 max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Manual Balances</h2>
        <p className="text-slate-400 text-sm mb-4">Schwab balances are pulled automatically. Enter your Fidelity and Ally balances below.</p>

        <div className="space-y-4">
          {FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label className="text-sm text-slate-400 block mb-1">{label}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="text"
                  value={formatWithCommas(balances[key])}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="bg-slate-700 text-slate-200 pl-7 pr-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 w-full"
                />
              </div>
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-50 w-full"
          >
            {saving ? "Saving..." : "Save Balances"}
          </button>

          {saved && <p className="text-green-400 text-sm">Balances saved.</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
}
