from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from activities import accounts, holdings, allocation, targets, suggestions, auth, contributions, balances

app = FastAPI(title="PortfolioBalancer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(accounts.router)
app.include_router(holdings.router)
app.include_router(allocation.router)
app.include_router(targets.router)
app.include_router(suggestions.router)
app.include_router(auth.router)
app.include_router(contributions.router)
app.include_router(balances.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
