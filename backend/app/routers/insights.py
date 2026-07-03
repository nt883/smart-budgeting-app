from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas import InsightsResponse
from app.dependencies import get_current_user
from app.insights import get_trends, get_forecast, get_anomalies, get_suggestions

router = APIRouter(prefix="/insights", tags=["insights"])

@router.get("/", response_model=InsightsResponse)
def get_all_insights(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {
        "trends": get_trends(db, current_user.id),
        "forecast": get_forecast(db, current_user.id),
        "anomalies": get_anomalies(db, current_user.id),
        "suggestions": get_suggestions(db, current_user.id)
    }