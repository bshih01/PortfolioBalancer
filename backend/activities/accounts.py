from fastapi import APIRouter
from components import fetch_accounts

router = APIRouter()


@router.get("/accounts")
def list_accounts():
    return fetch_accounts()
