from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas import DashboardSummary
from app.dependencies import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/summary", response_model=DashboardSummary)
def get_summary(
    month: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)
    if month:
        # month format expected: "2026-07"
        query = query.filter(func.to_char(Transaction.date, 'YYYY-MM') == month)

    transactions = query.all()

    total_income = sum(t.amount for t in transactions if t.type == "income")
    total_expenses = sum(t.amount for t in transactions if t.type == "expense")

    spend_by_category = {}
    for t in transactions:
        if t.type == "expense":
            spend_by_category[t.category] = spend_by_category.get(t.category, 0) + t.amount

    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "net_balance": total_income - total_expenses,
        "spend_by_category": spend_by_category
    }