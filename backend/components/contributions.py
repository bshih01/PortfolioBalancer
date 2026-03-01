import json
import os
from models import ContributionProfile, ContributionResult

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "contribution_profile.json")

LIMITS = {
    "employee_401k": 23500,
    "ira": 7000,
    "bracket_32_single": 197300,
    "bracket_32_mfj": 394600,
    "marginal_rate_above": 0.32,
}


def load_profile() -> ContributionProfile | None:
    if not os.path.exists(DATA_PATH):
        return None
    with open(DATA_PATH) as f:
        data = json.load(f)
    if not data:
        return None
    return ContributionProfile(**data)


def save_profile(profile: ContributionProfile):
    with open(DATA_PATH, "w") as f:
        json.dump(profile.model_dump(), f, indent=2)


def compute_contributions(profile: ContributionProfile) -> ContributionResult:
    income = profile.annual_income
    bracket_threshold = LIMITS["bracket_32_mfj"] if profile.filing_status == "mfj" else LIMITS["bracket_32_single"]
    max_401k = LIMITS["employee_401k"]
    max_ira = LIMITS["ira"]
    hysa_annual = profile.hysa_monthly * 12

    # Income above the 32% bracket threshold goes to Traditional 401k
    income_above_bracket = max(0, income - bracket_threshold)
    trad_401k = min(income_above_bracket, max_401k)

    # Remaining 401k space goes to Roth 401k
    roth_401k = max_401k - trad_401k

    # Full IRA goes to Roth
    roth_ira = max_ira

    # Total retirement + HYSA commitments
    committed = trad_401k + roth_401k + roth_ira + hysa_annual

    # Remaining goes to brokerage (can't be negative)
    brokerage = max(0, income - committed)

    # Estimate tax savings from traditional contributions
    tax_savings = round(trad_401k * LIMITS["marginal_rate_above"], 2)

    return ContributionResult(
        trad_401k=round(trad_401k / 12, 2),
        roth_401k=round(roth_401k / 12, 2),
        roth_ira=round(roth_ira / 12, 2),
        brokerage=round(brokerage / 12, 2),
        hysa=profile.hysa_monthly,
        annual_total=round(committed + brokerage, 2),
        tax_savings_estimate=tax_savings,
    )
