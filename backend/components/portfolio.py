import json
import os
from components.sector import classify_positions
from models import Position, Allocation, SectorInfo, Suggestion

TARGETS_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "targets.json")


def load_targets() -> dict[str, float]:
    with open(TARGETS_PATH) as f:
        return json.load(f)


def save_targets(targets: dict[str, float]):
    with open(TARGETS_PATH, "w") as f:
        json.dump(targets, f, indent=2)


def compute_allocation(all_positions: dict[str, list[Position]]) -> Allocation:
    flat: list[Position] = []
    for positions in all_positions.values():
        flat.extend(classify_positions(positions))

    total_value = sum(p.market_value for p in flat)
    if total_value == 0:
        return Allocation(sectors={}, total_value=0, positions=flat)

    sector_totals: dict[str, float] = {}
    for pos in flat:
        sector = pos.sector or "Other"
        sector_totals[sector] = sector_totals.get(sector, 0) + pos.market_value

    sectors = {}
    for sector, value in sorted(sector_totals.items(), key=lambda x: -x[1]):
        sectors[sector] = SectorInfo(
            value=round(value, 2),
            percent=round(value / total_value * 100, 2),
        )

    return Allocation(sectors=sectors, total_value=round(total_value, 2), positions=flat)


def suggest_buys(all_positions: dict[str, list[Position]], budget: float) -> list[Suggestion]:
    allocation = compute_allocation(all_positions)
    targets = load_targets()

    gaps = {}
    for sector, target_pct in targets.items():
        sector_info = allocation.sectors.get(sector)
        actual_pct = sector_info.percent if sector_info else 0
        gap = target_pct - actual_pct
        if gap > 0:
            gaps[sector] = gap

    if not gaps:
        return []

    total_gap = sum(gaps.values())
    suggestions = []
    for sector, gap in sorted(gaps.items(), key=lambda x: -x[1]):
        amount = round(budget * (gap / total_gap), 2)
        if amount < 1:
            continue

        sector_tickers = [p for p in allocation.positions if p.sector == sector]
        if sector_tickers:
            ticker = min(sector_tickers, key=lambda p: p.market_value).ticker
        else:
            ticker = f"[any {sector} stock/ETF]"

        suggestions.append(Suggestion(
            sector=sector,
            ticker=ticker,
            amount=amount,
            reason=f"{sector} is {round(gap, 1)}% underweight",
        ))

    return suggestions
