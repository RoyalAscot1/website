from fastapi import APIRouter, File, UploadFile
import pandas as pd
import io
from concurrent.futures import ThreadPoolExecutor

from database import database
from models import investment_snapshots, investments
from services.yahoo_service import get_ticker_info

router = APIRouter(prefix="/upload-CSV")

@router.post("/")
async def upload_csv(file: UploadFile = File(...)):
    # Handle CSV of investment snapshot
    # CSV upload format: TickerSymbol, QuantityHeld, AveragePurchasePrice
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))

    with ThreadPoolExecutor() as executor:
        ticker_data = list(executor.map(get_ticker_info, df["TickerSymbol"]))

    info_df = pd.DataFrame(ticker_data, index=df.index)
    df = pd.concat([df, info_df], axis=1)

    df["TotalValue"] = df["QuantityHeld"] * df["CurrentPrice"]
    df["UnrealizedGainLoss"] = (df["CurrentPrice"] - df["AveragePurchasePrice"]) * df["QuantityHeld"]
    df["Currency"] = "USD"
    df["AssetType"] = "Stock"

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