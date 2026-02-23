from fastapi import APIRouter, File, UploadFile
import pandas as pd
import io

from database import database
from models import investment_snapshots, investments

from services.yahoo_service import (
    get_investment_name,
    get_current_price,
    get_beta
)

router = APIRouter(prefix="/upload-CSV")

@router.post("/")
async def upload_csv(file: UploadFile = File(...)):
    # Handle CSV of investment snapshot
    # CSV upload format: TickerSymbol, QuantityHeld, AveragePurchasePrice
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    df["InvestmentName"] = df["TickerSymbol"].apply(get_investment_name)
    df["CurrentPrice"] = df["TickerSymbol"].apply(get_current_price)
    df["Beta"] = df["TickerSymbol"].apply(get_beta)
    df["TotalValue"] = df["QuantityHeld"] * df["CurrentPrice"]
    df["UnrealizedGainLoss"] = (df["CurrentPrice"] - df["AveragePurchasePrice"]) * df["QuantityHeld"]
    df["Currency"] = "USD"  # default currency
    df["AssetType"] = "Stock"  # infer dynamically later
    print(df)

    # Create new snapshot record
    snapshot_query = investment_snapshots.insert().values(description="No description")
    snapshot_id = await database.execute(snapshot_query)

    # Upload df into investments table
    records = df.to_dict(orient="records")
    for record in records:
        record["snapshot_id"] = snapshot_id # Assign the returned snapshot id
    await database.execute_many(query=investments.insert(), values=records)

    return {
        "message": "Uploaded investment snapshot",
        "snapshot_id": snapshot_id,
        "records_inserted": len(records)
    }