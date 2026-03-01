from pydantic import BaseModel


class BudgetRequest(BaseModel):
    budget: float
