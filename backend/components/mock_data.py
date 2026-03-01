from models import Account, Position

ACCOUNTS = [
    Account(accountNumber="1234567890", hashValue="mock_hash_1"),
    Account(accountNumber="0987654321", hashValue="mock_hash_2"),
]

POSITIONS: dict[str, list[Position]] = {
    "1234567890": [
        Position(ticker="AAPL", name="Apple Inc", asset_type="EQUITY", quantity=15, market_value=3375.00, average_price=185.00, sector="Technology"),
        Position(ticker="MSFT", name="Microsoft Corp", asset_type="EQUITY", quantity=10, market_value=4200.00, average_price=380.00, sector="Technology"),
        Position(ticker="VOO", name="Vanguard S&P 500 ETF", asset_type="ETF", quantity=8, market_value=3920.00, average_price=450.00, sector="Broad Market"),
        Position(ticker="QQQ", name="Invesco QQQ Trust", asset_type="ETF", quantity=5, market_value=2625.00, average_price=490.00, sector="Technology"),
        Position(ticker="JNJ", name="Johnson & Johnson", asset_type="EQUITY", quantity=12, market_value=1860.00, average_price=155.00, sector="Healthcare"),
        Position(ticker="JPM", name="JPMorgan Chase", asset_type="EQUITY", quantity=8, market_value=1840.00, average_price=210.00, sector="Financials"),
        Position(ticker="XOM", name="Exxon Mobil", asset_type="EQUITY", quantity=10, market_value=1100.00, average_price=105.00, sector="Energy"),
    ],
    "0987654321": [
        Position(ticker="VTI", name="Vanguard Total Stock Market ETF", asset_type="ETF", quantity=12, market_value=3240.00, average_price=250.00, sector="Broad Market"),
        Position(ticker="VXUS", name="Vanguard Total Intl Stock ETF", asset_type="ETF", quantity=20, market_value=1200.00, average_price=58.00, sector="International"),
        Position(ticker="SCHD", name="Schwab US Dividend Equity ETF", asset_type="ETF", quantity=15, market_value=1200.00, average_price=78.00, sector="Dividend"),
        Position(ticker="GOOGL", name="Alphabet Inc", asset_type="EQUITY", quantity=6, market_value=1080.00, average_price=165.00, sector="Technology"),
        Position(ticker="UNH", name="UnitedHealth Group", asset_type="EQUITY", quantity=3, market_value=1650.00, average_price=520.00, sector="Healthcare"),
    ],
}


def get_accounts() -> list[Account]:
    return ACCOUNTS


def get_positions(account_hash: str) -> list[Position]:
    for acct in ACCOUNTS:
        if acct.hashValue == account_hash:
            return POSITIONS.get(acct.accountNumber, [])
    return []


def get_all_positions() -> dict[str, list[Position]]:
    return {acct: POSITIONS.get(acct, []) for acct in POSITIONS}
