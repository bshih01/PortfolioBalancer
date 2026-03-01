import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getContributionProfile,
  saveContributionProfile,
  calculateContributions,
} from "../services/api";
import type { ContributionProfile, ContributionResult } from "../services/api";

const DEFAULT_PROFILE: ContributionProfile = {
  annual_income: 0,
  filing_status: "single",
  employer_401k_match_pct: 0,
  hysa_monthly: 1000,
};

const RESULT_LABELS: { key: keyof ContributionResult; label: string }[] = [
  { key: "trad_401k", label: "Traditional 401k" },
  { key: "roth_401k", label: "Roth 401k" },
  { key: "roth_ira", label: "Roth IRA" },
  { key: "brokerage", label: "Brokerage" },
  { key: "hysa", label: "HYSA" },
];

export default function ContributionPage() {
  const [profile, setProfile] = useState<ContributionProfile>(DEFAULT_PROFILE);
  const [result, setResult] = useState<ContributionResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getContributionProfile()
      .then((saved) => { if (saved && saved.annual_income) setProfile(saved); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (profile.annual_income <= 0) {
      setResult(null);
      return;
    }
    calculateContributions(profile)
      .then(setResult)
      .catch(() => setError("Failed to calculate. Is the backend running?"));
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContributionProfile(profile);
    } catch {
      setError("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const formatWithCommas = (num: number) =>
    num ? num.toLocaleString() : "";

  const parseCommaNumber = (value: string) =>
    parseFloat(value.replace(/,/g, "")) || 0;

  const updateField = (field: keyof ContributionProfile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: field === "filing_status" ? value : parseCommaNumber(value),
    }));
  };

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <header className="flex items-center gap-4 mb-8">
        <Link to="/" className="text-slate-400 hover:text-slate-200 text-sm">&larr; Home</Link>
        <h1 className="text-2xl font-bold">Contribution Allocator</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-1">Annual Gross Income</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="text"
                  value={formatWithCommas(profile.annual_income)}
                  onChange={(e) => updateField("annual_income", e.target.value)}
                  placeholder="200,000"
                  className="bg-slate-700 text-slate-200 pl-7 pr-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 w-full"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400 block mb-1">Filing Status</label>
              <select
                value={profile.filing_status}
                onChange={(e) => updateField("filing_status", e.target.value)}
                className="bg-slate-700 text-slate-200 px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 w-full"
              >
                <option value="single">Single</option>
                <option value="mfj">Married Filing Jointly</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-400 block mb-1">Employer 401k Match %</label>
              <div className="relative">
                <input
                  type="number"
                  value={profile.employer_401k_match_pct || ""}
                  onChange={(e) => updateField("employer_401k_match_pct", e.target.value)}
                  placeholder="0"
                  className="bg-slate-700 text-slate-200 px-3 py-2 pr-7 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 w-full"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-400 block mb-1">Monthly HYSA Contribution</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="text"
                  value={formatWithCommas(profile.hysa_monthly)}
                  onChange={(e) => updateField("hysa_monthly", e.target.value)}
                  className="bg-slate-700 text-slate-200 pl-7 pr-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500 w-full"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-50 w-full"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>

          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </div>

        {/* Results */}
        <div className="bg-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Breakdown</h2>
          {result ? (
            <div className="space-y-3">
              {RESULT_LABELS.map(({ key, label }) => (
                <div key={key} className="flex justify-between items-center bg-slate-700/50 px-4 py-3 rounded-lg">
                  <span className="text-slate-300">{label}</span>
                  <span className="font-semibold text-green-400">
                    ${result[key].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}

              <div className="border-t border-slate-600 pt-3 mt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Annual Total</span>
                  <span className="text-white font-semibold">
                    ${result.annual_total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">Est. Tax Savings (Trad 401k)</span>
                  <span className="text-blue-400 font-semibold">
                    ${result.tax_savings_estimate.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm">Enter your income to see the breakdown.</p>
          )}
        </div>
      </div>
    </div>
  );
}
