from fastapi import APIRouter
from models import AccountBalances
from models.balances import ProjectionResult
from components.balances import load_balances, save_balances, get_summary

router = APIRouter(prefix="/balances")


@router.get("")
def get_balances() -> AccountBalances:
    return load_balances()


@router.put("")
def update_balances(balances: AccountBalances) -> AccountBalances:
    save_balances(balances)
    return balances


@router.get("/summary")
def balance_summary() -> ProjectionResult:
    return get_summary()
