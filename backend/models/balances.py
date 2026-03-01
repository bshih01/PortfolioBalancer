from pydantic import BaseModel


class AccountBalances(BaseModel):
    fidelity_trad_401k: float = 0
    fidelity_roth_401k: float = 0
    ally_hysa: float = 0


class YearProjection(BaseModel):
    years: int
    schwab: float
    fidelity: float
    ally: float
    total: float


class ProjectionResult(BaseModel):
    current_total: float
    schwab_total: float
    fidelity_total: float
    ally_total: float
    schwab_cagr: float
    projections: list[YearProjection]
