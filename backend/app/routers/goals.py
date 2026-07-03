from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models.goal import Goal
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas import GoalCreate, GoalResponse, GoalUpdateSavings, AffordCheckResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/goals", tags=["goals"])

@router.get("/", response_model=List[GoalResponse])
def get_goals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Goal).filter(Goal.user_id == current_user.id).all()

@router.post("/", response_model=GoalResponse)
def create_goal(
    goal_data: GoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_goal = Goal(**goal_data.dict(), user_id=current_user.id, saved_amount=0.0)
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal

@router.put("/{goal_id}/add-savings", response_model=GoalResponse)
def add_savings(
    goal_id: int,
    savings_data: GoalUpdateSavings,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    goal.saved_amount += savings_data.amount_to_add
    db.commit()
    db.refresh(goal)
    return goal

@router.delete("/{goal_id}")
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal)
    db.commit()
    return {"message": "Goal deleted"}

@router.get("/afford-check", response_model=AffordCheckResponse)
def afford_check(
    item_cost: float,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = datetime.utcnow().date()
    current_month = today.strftime("%Y-%m")

    transactions = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    this_month = [t for t in transactions if t.date.strftime("%Y-%m") == current_month]

    income = sum(t.amount for t in this_month if t.type == "income")
    expenses = sum(t.amount for t in this_month if t.type == "expense")
    available = income - expenses

    if available >= item_cost:
        return {
            "can_afford": True,
            "message": f"Based on this month's spending, you have about R{round(available, 2)} available — you can afford this R{item_cost} purchase."
        }
    else:
        shortfall = item_cost - available
        return {
            "can_afford": False,
            "message": f"You're about R{round(shortfall, 2)} short right now based on this month's spending. Consider waiting or adjusting your budget."
        }