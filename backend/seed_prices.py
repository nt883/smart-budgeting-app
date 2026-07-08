from app.database import SessionLocal
from app.models.shopping import PriceCatalog

db = SessionLocal()

price_data = [
    ("bread", "Shoprite", 18.99),
    ("bread", "Pick n Pay", 21.50),
    ("bread", "Checkers", 19.99),
    ("milk", "Shoprite", 22.99),
    ("milk", "Pick n Pay", 24.99),
    ("milk", "Checkers", 23.50),
    ("rice", "Shoprite", 42.99),
    ("rice", "Pick n Pay", 48.99),
    ("rice", "Checkers", 45.99),
    ("chicken", "Shoprite", 79.99),
    ("chicken", "Pick n Pay", 89.99),
    ("chicken", "Checkers", 84.99),
    ("dish soap", "Shoprite", 27.99),
    ("dish soap", "Pick n Pay", 32.99),
    ("dish soap", "Checkers", 29.99),
    ("eggs", "Shoprite", 34.99),
    ("eggs", "Pick n Pay", 38.99),
    ("eggs", "Checkers", 36.50),
    ("sugar", "Shoprite", 24.99),
    ("sugar", "Pick n Pay", 27.99),
    ("sugar", "Checkers", 25.99),
    ("cooking oil", "Shoprite", 39.99),
    ("cooking oil", "Pick n Pay", 44.99),
    ("cooking oil", "Checkers", 41.99),
    ("maize meal", "Shoprite", 45.99),
    ("maize meal", "Pick n Pay", 49.99),
    ("maize meal", "Checkers", 47.99),
    ("toilet paper", "Shoprite", 54.99),
    ("toilet paper", "Pick n Pay", 59.99),
    ("toilet paper", "Checkers", 56.99),
]

for item_name, shop_name, price in price_data:
    entry = PriceCatalog(item_name=item_name, shop_name=shop_name, price=price)
    db.add(entry)

db.commit()
db.close()
print(f"Seeded {len(price_data)} price entries.")