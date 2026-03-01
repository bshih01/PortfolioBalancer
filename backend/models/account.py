from pydantic import BaseModel


class Account(BaseModel):
    accountNumber: str
    hashValue: str
