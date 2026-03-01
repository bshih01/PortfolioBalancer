const BASE = "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

function jsonBody(method: string, body: unknown): RequestInit {
  return { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

export interface Account {
  accountNumber: string;
}

export interface Position {
  ticker: string;
  name: string;
  quantity: number;
  market_value: number;
  sector: string | null;
}

export interface SectorInfo {
  percent: number;
}

export interface Allocation {
  total_value: number;
  sectors: Record<string, SectorInfo>;
  positions: Position[];
}

export interface Suggestion {
  ticker: string;
  sector: string;
  amount: number;
  reason: string;
}

export type Targets = Record<string, number>;

export const getAccounts = () => request<Account[]>("/accounts");
export const getAllocation = (account = "all") => request<Allocation>(`/allocation?account=${account}`);
export const getTargets = () => request<Targets>("/targets");
export const updateTargets = (targets: Targets) => request<Targets>("/targets", jsonBody("PUT", targets));
export const getSuggestions = (budget: number, account = "all") => request<Suggestion[]>(`/suggest?account=${account}`, jsonBody("POST", { budget }));

// Contribution Allocator

export interface ContributionProfile {
  annual_income: number;
  filing_status: string;
  employer_401k_match_pct: number;
  hysa_monthly: number;
}

export interface ContributionResult {
  trad_401k: number;
  roth_401k: number;
  roth_ira: number;
  brokerage: number;
  hysa: number;
  annual_total: number;
  tax_savings_estimate: number;
}

export interface ContributionLimits {
  employee_401k: number;
  ira: number;
  bracket_32_single: number;
  bracket_32_mfj: number;
  marginal_rate_above: number;
}

export const getContributionProfile = () => request<ContributionProfile | null>("/contributions/profile");
export const saveContributionProfile = (profile: ContributionProfile) => request<ContributionProfile>("/contributions/profile", jsonBody("PUT", profile));
export const calculateContributions = (profile: ContributionProfile) => request<ContributionResult>("/contributions/calculate", jsonBody("POST", profile));
export const getContributionLimits = () => request<ContributionLimits>("/contributions/limits");

// Account Balances & Projections

export interface AccountBalances {
  fidelity_trad_401k: number;
  fidelity_roth_401k: number;
  ally_hysa: number;
}

export interface YearProjection {
  years: number;
  schwab: number;
  fidelity: number;
  ally: number;
  total: number;
}

export interface ProjectionResult {
  current_total: number;
  schwab_total: number;
  fidelity_total: number;
  ally_total: number;
  schwab_cagr: number;
  projections: YearProjection[];
}

export const getBalances = () => request<AccountBalances>("/balances");
export const saveBalances = (balances: AccountBalances) => request<AccountBalances>("/balances", jsonBody("PUT", balances));
export const getBalanceSummary = () => request<ProjectionResult>("/balances/summary");
