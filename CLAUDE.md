# PortfolioBalancer

## Project Overview
Personal tool to read holdings from a Charles Schwab brokerage account and display a portfolio balance breakdown. Helps inform monthly stock purchases to maintain diversification and target allocations.

## Tech Stack
- **Backend**: Python (API layer, Schwab integration, portfolio logic)
- **Frontend**: React (portfolio visualization, balance dashboard)

## Project Structure
```
backend/
  main.py              # FastAPI app setup, CORS, router registration
  activities/          # One file per API endpoint (route handlers)
    accounts.py        # GET /accounts
    holdings.py        # GET /holdings
    allocation.py      # GET /allocation
    targets.py         # GET /targets, PUT /targets
    suggestions.py     # POST /suggest
    auth.py            # GET /auth
  models/              # Pydantic data models (Account, Position, Allocation, etc.)
  components/          # Business logic
    __init__.py        # Shared helpers (fetch_accounts, fetch_positions)
    portfolio.py       # Allocation computation, buy suggestions, targets I/O
    sector.py          # Sector classification (ETF lookup + yfinance)
    schwab_client.py   # Schwab API auth and data fetching
    mock_data.py       # Mock data for local development
  data/                # JSON data files (targets, ETF sectors)
frontend/              # React + TypeScript frontend
  src/
    components/        # UI components (.tsx)
    services/          # API client calls to backend (.ts)
```

## Conventions
- Python: use `venv` for virtual environment, `requirements.txt` for deps
- Frontend: use Vite + React, npm for package management
- Keep secrets (API keys, tokens) in `.env` files — never commit them
- Use snake_case for Python, camelCase for JS/TS

## Key Workflows
- `source backend/venv/bin/activate` — activate Python venv
- `pip install -r backend/requirements.txt` — install Python deps
- `cd frontend && npm install` — install frontend deps
- `cd frontend && npm run dev` — start frontend dev server

## Context Docs for Subagents
Standalone context files live in `docs/context/`. These are designed so a fresh agent with zero project knowledge can read them and immediately be useful.

- `project-overview.md` — what this project is, the stack, repo layout
- `conventions.md` — coding style and patterns to follow
- `code-review-guide.md` — instructions for a code review subagent

To spawn a code reviewer, use the Agent tool with a prompt like:
> Read `docs/context/code-review-guide.md` and `docs/context/project-overview.md`, then review the following files: [list]. Output advice only, do not edit.

## Self-Review
After any significant code change, pause and reflect before moving on:
- Is this the simplest way to do it? Could it be shorter?
- Am I overengineering? No abstractions until something is used 3+ times.
- Would a new developer understand this without comments? If not, simplify the code — don't add comments.
- Did I add anything that wasn't asked for? Remove it.
- Use the `/simplify` skill to audit changed code for reuse, quality, and conciseness.

## Security
- Schwab OAuth credentials must stay in `.env` and `.gitignore`
- Never log or expose account numbers, tokens, or full holdings to stdout in production
