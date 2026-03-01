from fastapi import APIRouter, HTTPException
from components import USE_MOCK

router = APIRouter()


@router.get("/auth")
def auth():
    """One-time endpoint to trigger OAuth flow. Run this first."""
    if USE_MOCK:
        return {"status": "mock mode — no auth needed"}
    try:
        from components.schwab_client import authenticate
        authenticate()
        return {"status": "authenticated"}
    except Exception as e:
        raise HTTPException(500, str(e))
