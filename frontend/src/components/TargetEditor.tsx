import { useState } from "react";
import { updateTargets } from "../services/api";
import type { Targets } from "../services/api";

interface Props {
  targets: Targets;
  onSave: (targets: Targets) => void;
}

export default function TargetEditor({ targets, onSave }: Props) {
  const [draft, setDraft] = useState<Targets>(targets);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = Object.values(draft).reduce((sum, v) => sum + v, 0);
  const isValid = Math.abs(total - 100) < 0.01;

  const handleChange = (sector: string, value: string) => {
    setDraft({ ...draft, [sector]: parseFloat(value) || 0 });
  };

  const handleSave = async () => {
    if (!isValid) return;
    setSaving(true);
    setError(null);
    try {
      const saved = await updateTargets(draft);
      onSave(saved);
    } catch {
      setError("Failed to save targets.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Edit Targets</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {Object.entries(draft).map(([sector, pct]) => (
          <div key={sector} className="flex items-center gap-2">
            <label className="text-sm text-slate-300 flex-1 truncate">{sector}</label>
            <div className="relative w-20">
              <input
                type="number"
                value={pct}
                onChange={(e) => handleChange(sector, e.target.value)}
                className="bg-slate-700 text-slate-200 px-2 py-1 pr-6 rounded border border-slate-600 focus:outline-none focus:border-blue-500 w-full text-sm"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-sm ${isValid ? "text-green-400" : "text-red-400"}`}>
          Total: {total.toFixed(1)}%
        </span>
        <button
          onClick={handleSave}
          disabled={!isValid || saving}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Targets"}
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}
