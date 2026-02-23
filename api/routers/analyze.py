from fastapi import APIRouter
import pandas as pd

from database import database
from models import investments
from services.analytics_service import compute_portfolio_analytics

router = APIRouter(prefix="/analyze")

@router.get("/{snapshot_id}")
async def analyze_snapshot(snapshot_id: int):
    query = investments.select().where(investments.c.snapshot_id == snapshot_id)
    snapshot = await database.fetch_all(query)
    
    if not snapshot:
        return {"error": "Snapshot not found"}
    
    rows = [dict(r) for r in snapshot]
    df = pd.DataFrame(rows)
    analytics = compute_portfolio_analytics(df)
    return analytics
