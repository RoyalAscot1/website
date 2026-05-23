from fastapi import APIRouter, Depends, HTTPException
import math
from auth import get_current_user
from database import database
from models import investment_snapshots, investments

router = APIRouter(prefix="/snapshots")


@router.get("/")
async def get_snapshots(user_id: str = Depends(get_current_user)):
    query = (
        investment_snapshots.select()
        .where(investment_snapshots.c.user_id == user_id)
        .order_by(investment_snapshots.c.uploaded_at.desc())
    )
    return await database.fetch_all(query)


@router.get("/{snapshot_id}")
async def get_snapshot_investments(snapshot_id: int, user_id: str = Depends(get_current_user)):
    snap = await database.fetch_one(
        investment_snapshots.select().where(
            investment_snapshots.c.id == snapshot_id,
            investment_snapshots.c.user_id == user_id,
        )
    )
    if not snap:
        raise HTTPException(status_code=404, detail="Snapshot not found")

    query = investments.select().where(investments.c.snapshot_id == snapshot_id)
    rows = await database.fetch_all(query)

    cleaned = []
    for row in rows:
        data = dict(row)
        for key, value in data.items():
            if isinstance(value, float) and math.isnan(value):
                data[key] = "N/A"
        cleaned.append(data)

    return cleaned
