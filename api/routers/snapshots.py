from fastapi import APIRouter
import math
from database import database
from models import investment_snapshots, investments

router = APIRouter(prefix="/snapshots")

@router.get("/")
async def get_snapshots():
    query = investment_snapshots.select().order_by(investment_snapshots.c.uploaded_at.desc())
    return await database.fetch_all(query)

@router.get("/{snapshot_id}")
async def get_snapshot_investments(snapshot_id: int):
    query = investments.select().where(investments.c.snapshot_id == snapshot_id)
    rows = await database.fetch_all(query)

    cleaned = []
    for row in rows:
        data = dict(row)

        # Fix NaN for Beta or any other float fields
        for key, value in data.items():
            if isinstance(value, float) and math.isnan(value):
                data[key] = "N/A"

        cleaned.append(data)

    return cleaned