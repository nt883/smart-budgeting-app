from pydantic import BaseModel, EmailStr
from datetime import date as date_type
from typing import Optional
from typing import Dict, List
from datetime import date as date_type

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

class DashboardSummary(BaseModel):
    total_income: float
    total_expenses: float
    net_balance: float
    spend_by_category: Dict[str, float]

class InsightsResponse(BaseModel):
    trends: List[str]
    forecast: List[str]
    anomalies: List[str]
    suggestions: List[str]


class GoalCreate(BaseModel):
    name: str
    target_amount: float
    target_date: date_type

class GoalResponse(BaseModel):
    id: int
    name: str
    target_amount: float
    target_date: date_type
    saved_amount: float

    class Config:
        from_attributes = True

class GoalUpdateSavings(BaseModel):
    amount_to_add: float

class AffordCheckResponse(BaseModel):
    can_afford: bool
    message: str    

class ShoppingItemInput(BaseModel):
    item_name: str
    quantity: int = 1

class ShoppingListCreate(BaseModel):
    budget: float
    items: List[ShoppingItemInput]

class ShoppingListResponse(BaseModel):
    id: int
    budget: float

    class Config:
        from_attributes = True

class PriceCatalogEntry(BaseModel):
    item_name: str
    shop_name: str
    price: float

class OptimizedItem(BaseModel):
    item_name: str
    requested_quantity: int
    included_quantity: int
    best_shop: str
    unit_price: float
    total_price: float
    included: bool

class OptimizeResponse(BaseModel):
    items: List[OptimizedItem]
    total_cost: float
    budget: float
    within_budget: bool
    dropped_items: List[str]
