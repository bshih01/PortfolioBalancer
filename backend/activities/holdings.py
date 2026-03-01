from fastapi import APIRouter, Query
from components import fetch_positions

router = APIRouter()


@router.get("/holdings")
def holdings(account: str = Query("all")):
    return fetch_positions(account)
