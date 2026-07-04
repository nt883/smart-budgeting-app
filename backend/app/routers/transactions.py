from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas import TransactionCreate, TransactionResponse
from app.dependencies import get_current_user
import pandas as pd
import io
from fastapi import UploadFile, File

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.get("/", response_model=List[TransactionResponse])
def get_transactions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Transaction).filter(Transaction.user_id == current_user.id).all()

@router.post("/", response_model=TransactionResponse)
def create_transaction(
    transaction_data: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_transaction = Transaction(**transaction_data.dict(), user_id=current_user.id)
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction

@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int,
    transaction_data: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id, Transaction.user_id == current_user.id
    ).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    for key, value in transaction_data.dict().items():
        setattr(transaction, key, value)

    db.commit()
    db.refresh(transaction)
    return transaction

@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id, Transaction.user_id == current_user.id
    ).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(transaction)
    db.commit()
    return {"message": "Transaction deleted"}

@router.post("/import-csv")
async def import_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="File must be a CSV")

    contents = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception:
        raise HTTPException(status_code=400, detail="Could not parse CSV file")

    required_columns = {"amount", "category", "date", "type"}
    if not required_columns.issubset(set(df.columns.str.lower())):
        raise HTTPException(
            status_code=400,
            detail=f"CSV must contain columns: {', '.join(required_columns)} (description is optional)"
        )

    df.columns = df.columns.str.lower()

    created_count = 0
    skipped_rows = []

    for index, row in df.iterrows():
        try:
            row_type = str(row["type"]).strip().lower()
            if row_type not in ("income", "expense"):
                skipped_rows.append(index + 2)
                continue

            parsed_date = pd.to_datetime(row["date"]).date()

            new_transaction = Transaction(
                user_id=current_user.id,
                amount=float(row["amount"]),
                category=str(row["category"]).strip(),
                description=str(row["description"]).strip() if "description" in df.columns and pd.notna(row.get("description")) else None,
                date=parsed_date,
                type=row_type
            )
            db.add(new_transaction)
            created_count += 1
        except Exception:
            skipped_rows.append(index + 2)
            continue

    db.commit()

    return {
        "imported": created_count,
        "skipped_rows": skipped_rows,
        "message": f"Successfully imported {created_count} transactions" + (f", skipped {len(skipped_rows)} invalid rows" if skipped_rows else "")
    }