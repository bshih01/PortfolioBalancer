import os
import schwab
from dotenv import load_dotenv
from models import Account, Position

load_dotenv()

API_KEY = os.getenv("SCHWAB_API_KEY")
APP_SECRET = os.getenv("SCHWAB_APP_SECRET")
CALLBACK_URL = os.getenv("SCHWAB_CALLBACK_URL", "https://127.0.0.1")
TOKEN_PATH = os.getenv("SCHWAB_TOKEN_PATH", "./data/token.json")


def get_client():
    return schwab.auth.client_from_token_file(TOKEN_PATH, API_KEY, APP_SECRET)


def authenticate():
    """Run once to generate the initial token file via browser OAuth flow."""
    return schwab.auth.client_from_manual_flow(
        API_KEY, APP_SECRET, CALLBACK_URL, TOKEN_PATH
    )


def get_accounts(client) -> list[Account]:
    resp = client.get_account_numbers()
    resp.raise_for_status()
    return [Account(**a) for a in resp.json()]


def get_positions(client, account_hash: str) -> list[Position]:
    resp = client.get_account(
        account_hash, fields=client.Account.Fields.POSITIONS
    )
    resp.raise_for_status()
    data = resp.json()

    positions = []
    for pos in data.get("securitiesAccount", {}).get("positions", []):
        instrument = pos.get("instrument", {})
        positions.append(Position(
            ticker=instrument.get("symbol", ""),
            name=instrument.get("description", ""),
            asset_type=instrument.get("assetType", ""),
            quantity=pos.get("longQuantity", 0),
            market_value=pos.get("marketValue", 0),
            average_price=pos.get("averagePrice", 0),
        ))
    return positions


def get_all_positions(client) -> dict[str, list[Position]]:
    accounts = get_accounts(client)
    result = {}
    for acct in accounts:
        result[acct.accountNumber] = get_positions(client, acct.hashValue)
    return result
