# Requirements — PortfolioBalancer v1

## Goal
Connect to personal Schwab brokerage accounts, display portfolio breakdown by sector, compare against target allocations, and suggest what to buy each month to stay balanced.

## Data Source
- **Schwab API (OAuth)** — real-time holdings data
- Support **multiple accounts** (e.g., individual brokerage + Roth IRA)
- Holdings include **individual stocks and ETFs**

## Core Features

### 1. Account Connection
- OAuth flow with Schwab's developer API
- Store/refresh tokens securely (never committed, `.env` only)
- Pull holdings from all linked accounts

### 2. Portfolio Breakdown
- Aggregate holdings across all accounts into one view
- Classify each holding by **sector** (Technology, Healthcare, Financials, Energy, etc.)
- For ETFs, use the ETF's primary sector or category (e.g., VOO = Broad Market, QQQ = Technology)
- Display current allocation as **percentage of total portfolio value**

### 3. Target Allocations
- User defines target percentages **per sector** (must sum to 100%)
- Persist targets locally (config file or simple DB)
- Show **actual vs. target** side-by-side for each sector
- Highlight sectors that are overweight or underweight

### 4. Buy Suggestions
- User inputs a **monthly budget** (e.g., "I have $500 to invest")
- App calculates which sectors are most underweight
- Suggests **specific dollar amounts per ticker** to bring portfolio closer to target
- Prioritize buying underweight positions, never suggest selling

### 5. Frontend Dashboard
- Clean, styled UI (not just a raw table)
- **Pie or donut chart** — current sector allocation
- **Bar chart** — actual vs. target per sector
- **Suggestions panel** — given a budget, show what to buy
- **Account selector** — view combined or per-account breakdown
- Responsive layout

## Non-Goals (v1)
- No automatic trade execution — read-only
- No historical tracking or performance over time
- No options, bonds, or crypto support
- No mobile app — web only
- No multi-user / auth on the frontend (personal tool)

## Technical Constraints
- Backend: Python (FastAPI or Flask)
- Frontend: React + Vite
- Schwab API requires registered developer app + OAuth2
- All secrets in `.env`, never committed
