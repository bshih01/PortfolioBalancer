import json
import os
import yfinance as yf

ETF_SECTORS_PATH = os.path.join(os.path.dirname(__file__), "data", "etf_sectors.json")

_sector_cache = {}
_etf_sectors = None


def _load_etf_sectors():
    global _etf_sectors
    if _etf_sectors is None:
        with open(ETF_SECTORS_PATH) as f:
            _etf_sectors = json.load(f)
    return _etf_sectors


def get_sector(ticker: str) -> str:
    if ticker in _sector_cache:
        return _sector_cache[ticker]

    etf_sectors = _load_etf_sectors()
    if ticker in etf_sectors:
        _sector_cache[ticker] = etf_sectors[ticker]
        return _sector_cache[ticker]

    try:
        info = yf.Ticker(ticker).info
        sector = info.get("sector", "Other")
    except Exception:
        sector = "Other"

    _sector_cache[ticker] = sector
    return sector


def classify_positions(positions: list[dict]) -> list[dict]:
    for pos in positions:
        if not pos.get("sector"):
            pos["sector"] = get_sector(pos["ticker"])
    return positions
