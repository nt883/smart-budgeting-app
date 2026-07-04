from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.shopping import ShoppingList, ShoppingListItem, PriceCatalog
from app.models.user import User
from app.schemas import (
    ShoppingListCreate, ShoppingListResponse,
    PriceCatalogEntry, OptimizeResponse, OptimizedItem
)
from app.dependencies import get_current_user

router = APIRouter(prefix="/shopping-lists", tags=["shopping"])
price_router = APIRouter(prefix="/price-catalog", tags=["price-catalog"])


@router.post("/", response_model=ShoppingListResponse)
def create_shopping_list(
    list_data: ShoppingListCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_list = ShoppingList(budget=list_data.budget, user_id=current_user.id)
    db.add(new_list)
    db.commit()
    db.refresh(new_list)

    for item in list_data.items:
        db.add(ShoppingListItem(
            list_id=new_list.id,
            item_name=item.item_name,
            quantity=item.quantity
        ))
    db.commit()

    return new_list


@router.get("/{list_id}/optimize", response_model=OptimizeResponse)
def optimize_shopping_list(
    list_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    shopping_list = db.query(ShoppingList).filter(
        ShoppingList.id == list_id, ShoppingList.user_id == current_user.id
    ).first()
    if not shopping_list:
        raise HTTPException(status_code=404, detail="Shopping list not found")

    list_items = db.query(ShoppingListItem).filter(ShoppingListItem.list_id == list_id).all()

    priced_items = []
    for li in list_items:
        catalog_matches = db.query(PriceCatalog).filter(
            PriceCatalog.item_name.ilike(li.item_name)
        ).all()

        if not catalog_matches:
            priced_items.append({
                "item_name": li.item_name,
                "requested_quantity": li.quantity,
                "included_quantity": 0,
                "best_shop": "unknown",
                "unit_price": 0.0,
                "total_price": 0.0,
                "included": False
            })
            continue

        cheapest = min(catalog_matches, key=lambda c: c.price)
        priced_items.append({
            "item_name": li.item_name,
            "requested_quantity": li.quantity,
            "included_quantity": 0,  # filled in below
            "best_shop": cheapest.shop_name,
            "unit_price": cheapest.price,
            "total_price": 0.0,  # filled in below
            "included": False
        })

    # cheapest unit price first, so we maximize how much fits in the budget
    priced_items.sort(key=lambda i: i["unit_price"])

    remaining_budget = shopping_list.budget
    running_total = 0.0
    dropped = []

    for item in priced_items:
        if item["unit_price"] == 0.0:
            continue  # no price data, can't include

        max_affordable_units = int(remaining_budget // item["unit_price"])
        units_to_include = min(max_affordable_units, item["requested_quantity"])

        if units_to_include > 0:
            cost = round(units_to_include * item["unit_price"], 2)
            item["included_quantity"] = units_to_include
            item["total_price"] = cost
            item["included"] = True
            remaining_budget -= cost
            running_total += cost

        if units_to_include < item["requested_quantity"]:
            shortfall = item["requested_quantity"] - units_to_include
            dropped.append(f"{item['item_name']} (short by {shortfall})")

    return {
        "items": priced_items,
        "total_cost": round(running_total, 2),
        "budget": shopping_list.budget,
        "within_budget": running_total <= shopping_list.budget,
        "dropped_items": dropped
    }


@price_router.post("/")
def add_price(
    entry: PriceCatalogEntry,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_entry = PriceCatalog(**entry.dict())
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry


@price_router.get("/")
def list_prices(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(PriceCatalog).all()