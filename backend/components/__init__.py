import os
from fastapi import HTTPException
from models import Account, Position

USE_MOCK = os.getenv("USE_MOCK", "false").lower() == "true"

if USE_MOCK:
    from components import mock_data as _data
else:
    from components import schwab_client as _data


def fetch_accounts() -> list[Account]:
    if USE_MOCK:
        return _data.get_accounts()
    return _data.get_accounts(_data.get_client())


def fetch_positions(account="all") -> dict[str, list[Position]]:
    if USE_MOCK:
        if account == "all":
            return _data.get_all_positions()
        accts = _data.get_accounts()
    else:
        client = _data.get_client()
        if account == "all":
            return _data.get_all_positions(client)
        accts = _data.get_accounts(client)

    match = next((a for a in accts if a.accountNumber == account), None)
    if not match:
        raise HTTPException(404, "Account not found")

    if USE_MOCK:
        return {account: _data.get_positions(match.hashValue)}
    return {account: _data.get_positions(client, match.hashValue)}
