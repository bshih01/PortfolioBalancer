from pydantic import BaseModel


class ContributionProfile(BaseModel):
    annual_income: float
    filing_status: str = "single"
    employer_401k_match_pct: float = 0
    hysa_monthly: float = 1000


class ContributionResult(BaseModel):
    trad_401k: float
    roth_401k: float
    roth_ira: float
    brokerage: float
    hysa: float
    annual_total: float
    tax_savings_estimate: float
