from fastapi import APIRouter, HTTPException, Query
from components import fetch_positions
from components.portfolio import suggest_buys
from models import BudgetRequest

router = APIRouter()


@router.post("/suggest")
def suggest(req: BudgetRequest, account: str = Query("all")):
    if req.budget <= 0:
        raise HTTPException(400, "Budget must be positive")
    return suggest_buys(fetch_positions(account), req.budget)
