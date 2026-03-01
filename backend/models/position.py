from pydantic import BaseModel


class Position(BaseModel):
    ticker: str
    name: str = ""
    asset_type: str = ""
    quantity: float = 0
    market_value: float = 0
    average_price: float = 0
    sector: str | None = None
