from fastapi import APIRouter, Depends, HTTPException
import pandas as pd

from auth import get_current_user
from database import database
from models import investment_snapshots, investments
from services.analytics_service import compute_portfolio_analytics

router = APIRouter(prefix="/analyze")


async def analyze_snapshot(snapshot_id: int):
    """Service function — called directly by recommendations router, no auth."""
    query = investments.select().where(investments.c.snapshot_id == snapshot_id)
    snapshot = await database.fetch_all(query)
    if not snapshot:
        raise HTTPException(status_code=404, detail="Snapshot not found")
    rows = [dict(r) for r in snapshot]
    df = pd.DataFrame(rows)
    return compute_portfolio_analytics(df)


@router.get("/{snapshot_id}")
async def analyze_snapshot_route(snapshot_id: int, user_id: str = Depends(get_current_user)):
    snap = await database.fetch_one(
        investment_snapshots.select().where(
            investment_snapshots.c.id == snapshot_id,
            investment_snapshots.c.user_id == user_id,
        )
    )
    if not snap:
        raise HTTPException(status_code=404, detail="Snapshot not found")
    return await analyze_snapshot(snapshot_id)
