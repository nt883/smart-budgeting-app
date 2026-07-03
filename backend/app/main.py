from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import user  # noqa: F401
from app.routers import auth
from app.models import transaction  # noqa: F401
from app.routers import transactions
from app.routers import auth, transactions, budgets
from app.routers import auth, transactions, budgets, dashboard




Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Budgeting App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(transactions.router)
app.include_router(budgets.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message": "Smart Budgeting App API is running"}

