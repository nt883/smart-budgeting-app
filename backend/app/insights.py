
from datetime import datetime
from collections import defaultdict
from sqlalchemy.orm import Session
from app.models.transaction import Transaction


def _month_key(date_val):
    return date_val.strftime("%Y-%m")


def _spend_by_month_category(transactions):
    result = defaultdict(lambda: defaultdict(float))
    for t in transactions:
        if t.type == "expense":
            result[_month_key(t.date)][t.category] += t.amount
    return result


def get_trends(db: Session, user_id: int):
    transactions = db.query(Transaction).filter(Transaction.user_id == user_id).all()
    by_month = _spend_by_month_category(transactions)

    months = sorted(by_month.keys())
    if len(months) < 2:
        return []

    current_month, previous_month = months[-1], months[-2]
    trends = []

    categories = set(by_month[current_month]) | set(by_month[previous_month])
    for category in categories:
        current = by_month[current_month].get(category, 0)
        previous = by_month[previous_month].get(category, 0)
        if previous == 0:
            continue
        change_pct = ((current - previous) / previous) * 100
        if abs(change_pct) >= 15:
            direction = "more" if change_pct > 0 else "less"
            trends.append(
                f"You spent {abs(round(change_pct))}% {direction} on {category} this month than last month."
            )
    return trends


def get_forecast(db: Session, user_id: int):
    today = datetime.utcnow().date()
    current_month = _month_key(today)

    transactions = db.query(Transaction).filter(
        Transaction.user_id == user_id, Transaction.type == "expense"
    ).all()

    this_month_transactions = [t for t in transactions if _month_key(t.date) == current_month]
    total_so_far = sum(t.amount for t in this_month_transactions)

    day_of_month = today.day
    days_in_month = 30

    if day_of_month == 0 or total_so_far == 0:
        return []

    daily_rate = total_so_far / day_of_month
    projected_total = daily_rate * days_in_month

    return [
        f"At your current pace, you're projected to spend about R{round(projected_total, 2)} this month."
    ]


def get_anomalies(db: Session, user_id: int):
    transactions = db.query(Transaction).filter(
        Transaction.user_id == user_id, Transaction.type == "expense"
    ).all()

    by_category = defaultdict(list)
    for t in transactions:
        by_category[t.category].append(t)

    anomalies = []
    for category, txns in by_category.items():
        if len(txns) < 3:
            continue
        amounts = [t.amount for t in txns]
        avg = sum(amounts) / len(amounts)
        for t in txns:
            if avg > 0 and t.amount >= avg * 2.5:
                multiple = round(t.amount / avg, 1)
                anomalies.append(
                    f"Your {category} transaction of R{t.amount} is {multiple}x your usual {category} spend."
                )
    return anomalies


def get_suggestions(db: Session, user_id: int):
    transactions = db.query(Transaction).filter(
        Transaction.user_id == user_id, Transaction.type == "expense"
    ).all()

    by_category = defaultdict(float)
    for t in transactions:
        by_category[t.category] += t.amount

    if not by_category:
        return []

    top_category = max(by_category, key=by_category.get)
    top_amount = by_category[top_category]

    suggestion = (
        f"Your biggest expense category is {top_category} at R{round(top_amount, 2)}. "
        f"Cutting it by 10% could save you about R{round(top_amount * 0.1, 2)}."
    )
    return [suggestion]
