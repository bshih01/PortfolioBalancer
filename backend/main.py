import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from portfolio import compute_allocation, suggest_buys, load_targets, save_targets

USE_MOCK = os.getenv("USE_MOCK", "false").lower() == "true"

app = FastAPI(title="PortfolioBalancer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


if USE_MOCK:
    import mock_data as _data
else:
    import schwab_client as _data


def _fetch_accounts():
    if USE_MOCK:
        return _data.get_accounts()
    return _data.get_accounts(_data.get_client())


def _fetch_positions(account="all"):
    if USE_MOCK:
        if account == "all":
            return _data.get_all_positions()
        accts = _data.get_accounts()
    else:
        client = _data.get_client()
        if account == "all":
            return _data.get_all_positions(client)
        accts = _data.get_accounts(client)

    match = next((a for a in accts if a["accountNumber"] == account), None)
    if not match:
        raise HTTPException(404, "Account not found")

    if USE_MOCK:
        return {account: _data.get_positions(match["hashValue"])}
    return {account: _data.get_positions(client, match["hashValue"])}


@app.get("/accounts")
def list_accounts():
    return _fetch_accounts()


@app.get("/holdings")
def holdings(account: str = Query("all")):
    return _fetch_positions(account)


@app.get("/allocation")
def allocation(account: str = Query("all")):
    return compute_allocation(_fetch_positions(account))


@app.get("/targets")
def get_targets():
    return load_targets()


@app.put("/targets")
def update_targets(targets: dict[str, float]):
    total = sum(targets.values())
    if abs(total - 100) > 0.01:
        raise HTTPException(400, f"Targets must sum to 100% (got {total}%)")
    save_targets(targets)
    return targets


class BudgetRequest(BaseModel):
    budget: float


@app.post("/suggest")
def suggest(req: BudgetRequest, account: str = Query("all")):
    if req.budget <= 0:
        raise HTTPException(400, "Budget must be positive")
    return suggest_buys(_fetch_positions(account), req.budget)


@app.get("/auth")
def auth():
    """One-time endpoint to trigger OAuth flow. Run this first."""
    if USE_MOCK:
        return {"status": "mock mode — no auth needed"}
    try:
        from schwab_client import authenticate
        authenticate()
        return {"status": "authenticated"}
    except Exception as e:
        raise HTTPException(500, str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
