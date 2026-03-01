from fastapi import APIRouter, Query
from components import fetch_positions
from components.portfolio import compute_allocation

router = APIRouter()


@router.get("/allocation")
def allocation(account: str = Query("all")):
    return compute_allocation(fetch_positions(account))
