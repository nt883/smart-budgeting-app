from datetime import datetime
from calendar import monthrange
from collections import defaultdict
from sqlalchemy.orm import Session
from app.models.transaction import Transaction

SAVINGS_CATEGORY = "Savings"


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
            if category == SAVINGS_CATEGORY:
                trends.append(f"You saved {abs(round(change_pct))}% {direction} this month than last month.")
            else:
                trends.append(f"You spent {abs(round(change_pct))}% {direction} on {category} this month than last month.")
    return trends


def get_forecast(db: Session, user_id: int):
    today = datetime.utcnow().date()
    current_month = _month_key(today)
    days_in_month = monthrange(today.year, today.month)[1]

    transactions = db.query(Transaction).filter(
        Transaction.user_id == user_id, Transaction.type == "expense"
    ).all()

    this_month_transactions = [t for t in transactions if _month_key(t.date) == current_month]
    day_of_month = today.day

    if day_of_month == 0:
        return []

    forecasts = []

    spending_so_far = sum(t.amount for t in this_month_transactions if t.category != SAVINGS_CATEGORY)
    if spending_so_far > 0:
        daily_rate = spending_so_far / day_of_month
        projected_total = daily_rate * days_in_month
        forecasts.append(f"At your current pace, you're projected to spend about R{round(projected_total, 2)} this month.")

    savings_so_far = sum(t.amount for t in this_month_transactions if t.category == SAVINGS_CATEGORY)
    if savings_so_far > 0:
        daily_savings_rate = savings_so_far / day_of_month
        projected_savings = daily_savings_rate * days_in_month
        forecasts.append(f"At your current pace, you're on track to save about R{round(projected_savings, 2)} this month.")

    return forecasts


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
        for t in txns:
            others = [a for a in amounts if a != t.amount or amounts.count(t.amount) > 1]
            # exclude this specific transaction's own amount from the baseline average
            remaining = amounts[:]
            remaining.remove(t.amount)
            if not remaining:
                continue
            avg = sum(remaining) / len(remaining)
            if avg > 0 and t.amount >= avg * 2.5:
                multiple = round(t.amount / avg, 1)
                if category == SAVINGS_CATEGORY:
                    anomalies.append(f"You saved R{t.amount} in one go — {multiple}x your usual savings amount. Nice work.")
                else:
                    anomalies.append(f"Your {category} transaction of R{t.amount} is {multiple}x your usual {category} spend.")
    return anomalies


def get_suggestions(db: Session, user_id: int):
    transactions = db.query(Transaction).filter(Transaction.user_id == user_id).all()

    today = datetime.utcnow().date()
    current_month = _month_key(today)
    this_month = [t for t in transactions if _month_key(t.date) == current_month]

    income = sum(t.amount for t in this_month if t.type == "income")
    expenses_by_category = defaultdict(float)
    for t in this_month:
        if t.type == "expense" and t.category != SAVINGS_CATEGORY:
            expenses_by_category[t.category] += t.amount
    total_saved = sum(t.amount for t in this_month if t.type == "expense" and t.category == SAVINGS_CATEGORY)

    suggestions = []

    if expenses_by_category:
        top_category = max(expenses_by_category, key=expenses_by_category.get)
        top_amount = expenses_by_category[top_category]
        suggestions.append(
            f"Your biggest expense category is {top_category} at R{round(top_amount, 2)}. "
            f"Cutting it by 10% could save you about R{round(top_amount * 0.1, 2)}."
        )

    if income > 0:
        savings_rate = (total_saved / income) * 100
        if total_saved == 0:
            suggestions.append("You haven't logged any savings yet this month — even a small, consistent amount adds up over time.")
        elif savings_rate < 10:
            suggestions.append(f"You're saving about {round(savings_rate)}% of your income this month. Aiming for 10-20% is a solid general target.")
        else:
            suggestions.append(f"You're saving about {round(savings_rate)}% of your income this month — solid habit.")

    return suggestions