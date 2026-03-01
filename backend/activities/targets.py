from fastapi import APIRouter, HTTPException
from components.portfolio import load_targets, save_targets

router = APIRouter()


@router.get("/targets")
def get_targets():
    return load_targets()


@router.put("/targets")
def update_targets(targets: dict[str, float]):
    total = sum(targets.values())
    if abs(total - 100) > 0.01:
        raise HTTPException(400, f"Targets must sum to 100% (got {total}%)")
    save_targets(targets)
    return targets
