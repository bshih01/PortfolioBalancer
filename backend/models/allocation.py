from pydantic import BaseModel
from models.position import Position


class SectorInfo(BaseModel):
    value: float
    percent: float


class Allocation(BaseModel):
    sectors: dict[str, SectorInfo]
    total_value: float
    positions: list[Position]
