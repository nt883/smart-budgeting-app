from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database import Base

class ShoppingList(Base):
    __tablename__ = "shopping_lists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    budget = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ShoppingListItem(Base):
    __tablename__ = "shopping_list_items"

    id = Column(Integer, primary_key=True, index=True)
    list_id = Column(Integer, ForeignKey("shopping_lists.id"), nullable=False)
    item_name = Column(String, nullable=False)
    quantity = Column(Integer, default=1)


class PriceCatalog(Base):
    __tablename__ = "price_catalog"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String, nullable=False, index=True)
    shop_name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())