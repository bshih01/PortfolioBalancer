# Project Overview

PortfolioBalancer is a personal tool that connects to a Charles Schwab brokerage account, reads current holdings, and displays a portfolio breakdown. The goal is to help decide what stocks to buy each month to stay diversified and on-target.

## Stack
- **Backend**: Python — Schwab API integration, portfolio logic, REST API
- **Frontend**: React (Vite) — dashboard and visualization

## Repo Layout
```
backend/          # Python backend
  schwab/         # Schwab API client and OAuth
  portfolio/      # Portfolio analysis and balancing logic
  api/            # REST endpoints serving the frontend
frontend/         # React app
  src/
    components/   # UI components
    hooks/        # Custom React hooks
    services/     # API client calls to backend
docs/context/     # Context docs for subagents
```
