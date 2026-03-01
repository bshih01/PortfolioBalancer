import json
import os
import yfinance as yf
from models import AccountBalances
from models.balances import YearProjection, ProjectionResult
from components import fetch_positions

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "account_balances.json")

SP500_CAGR = 0.10
HYSA_RATE = 0.03
PROJECTION_YEARS = [10, 20, 30]


def load_balances() -> AccountBalances:
    if not os.path.exists(DATA_PATH):
        return AccountBalances()
    with open(DATA_PATH) as f:
        data = json.load(f)
    if not data:
        return AccountBalances()
    return AccountBalances(**data)


def save_balances(balances: AccountBalances):
    with open(DATA_PATH, "w") as f:
        json.dump(balances.model_dump(), f, indent=2)


def get_schwab_total() -> float:
    positions = fetch_positions("all")
    total = 0.0
    for acct_positions in positions.values():
        for pos in acct_positions:
            total += pos.market_value
    return round(total, 2)


def compute_schwab_cagr() -> float:
    positions = fetch_positions("all")
    flat = []
    for acct_positions in positions.values():
        flat.extend(acct_positions)

    if not flat:
        return SP500_CAGR

    total_value = sum(p.market_value for p in flat)
    if total_value == 0:
        return SP500_CAGR

    weighted_cagr = 0.0
    for pos in flat:
        weight = pos.market_value / total_value
        try:
            ticker = yf.Ticker(pos.ticker)
            hist = ticker.history(period="5y")
            if len(hist) < 2:
                weighted_cagr += weight * SP500_CAGR
                continue
            start_price = hist["Close"].iloc[0]
            end_price = hist["Close"].iloc[-1]
            years = len(hist) / 252
            if start_price > 0 and years > 0:
                cagr = (end_price / start_price) ** (1 / years) - 1
                weighted_cagr += weight * cagr
            else:
                weighted_cagr += weight * SP500_CAGR
        except Exception:
            weighted_cagr += weight * SP500_CAGR

    return round(weighted_cagr, 4)


def get_summary() -> ProjectionResult:
    balances = load_balances()
    schwab_total = get_schwab_total()
    fidelity_total = balances.fidelity_trad_401k + balances.fidelity_roth_401k
    ally_total = balances.ally_hysa
    current_total = schwab_total + fidelity_total + ally_total

    schwab_cagr = compute_schwab_cagr()

    projections = []
    for years in PROJECTION_YEARS:
        schwab_future = round(schwab_total * (1 + schwab_cagr) ** years, 2)
        fidelity_future = round(fidelity_total * (1 + SP500_CAGR) ** years, 2)
        ally_future = round(ally_total * (1 + HYSA_RATE) ** years, 2)
        projections.append(YearProjection(
            years=years,
            schwab=schwab_future,
            fidelity=fidelity_future,
            ally=ally_future,
            total=round(schwab_future + fidelity_future + ally_future, 2),
        ))

    return ProjectionResult(
        current_total=round(current_total, 2),
        schwab_total=schwab_total,
        fidelity_total=round(fidelity_total, 2),
        ally_total=round(ally_total, 2),
        schwab_cagr=round(schwab_cagr * 100, 2),
        projections=projections,
    )
