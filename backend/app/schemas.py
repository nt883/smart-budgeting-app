from pydantic import BaseModel, EmailStr
from datetime import date as date_type
from typing import Optional


class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TransactionCreate(BaseModel):
    amount: float
    category: str
    description: Optional[str] = None
    date: date_type
    type: str  # "income" or "expense"

class TransactionResponse(BaseModel):
    id: int
    amount: float
    category: str
    description: Optional[str]
    date: date_type
    type: str

    class Config:
        from_attributes = True   

class BudgetCreate(BaseModel):
    category: str
    monthly_limit: float
    month: str  # "2026-07"

class BudgetResponse(BaseModel):
    id: int
    category: str
    monthly_limit: float
    month: str

    class Config:
        from_attributes = True

