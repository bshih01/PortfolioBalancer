from fastapi import APIRouter
from models import ContributionProfile, ContributionResult
from components.contributions import load_profile, save_profile, compute_contributions, LIMITS

router = APIRouter(prefix="/contributions")


@router.get("/profile")
def get_profile() -> ContributionProfile | None:
    return load_profile()


@router.put("/profile")
def update_profile(profile: ContributionProfile) -> ContributionProfile:
    save_profile(profile)
    return profile


@router.post("/calculate")
def calculate(profile: ContributionProfile) -> ContributionResult:
    return compute_contributions(profile)


@router.get("/limits")
def get_limits() -> dict:
    return LIMITS
