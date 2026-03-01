from pydantic import BaseModel


class Suggestion(BaseModel):
    sector: str
    ticker: str
    amount: float
    reason: str
