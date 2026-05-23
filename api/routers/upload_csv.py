from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
import pandas as pd
import io
from concurrent.futures import ThreadPoolExecutor

from auth import get_current_user
from database import database
from limiter import limiter
from models import investment_snapshots, investments
from services.yahoo_service import get_ticker_info

REQUIRED_COLUMNS = {"TickerSymbol", "QuantityHeld", "AveragePurchasePrice"}

router = APIRouter(prefix="/upload-CSV")

@router.post("/")
@limiter.limit("3/minute")
async def upload_csv(request: Request, file: UploadFile = File(...), user_id: str = Depends(get_current_user)):
    # Handle CSV of investment snapshot
    # CSV upload format: TickerSymbol, QuantityHeld, AveragePurchasePrice
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")), skipinitialspace=True)

    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise HTTPException(
            status_code=422,
            detail=f"CSV is missing required columns: {missing}. "
                   f"Got: {list(df.columns)}"
        )

    # Keep only the 3 expected columns so extra CSV columns (e.g. CurrentPrice)
    # don't create duplicate column names after the yfinance concat below.
    df = df[["TickerSymbol", "QuantityHeld", "AveragePurchasePrice"]].copy()
    df["QuantityHeld"] = pd.to_numeric(df["QuantityHeld"], errors="coerce")
    df["AveragePurchasePrice"] = pd.to_numeric(df["AveragePurchasePrice"], errors="coerce")
    df = df.reset_index(drop=True)

    with ThreadPoolExecutor(max_workers=10) as executor:
        ticker_data = list(executor.map(get_ticker_info, df["TickerSymbol"]))

    info_df = pd.DataFrame(ticker_data, index=df.index)
    df = pd.concat([df, info_df], axis=1)

    bad_tickers = df[df["CurrentPrice"].isna()]["TickerSymbol"].tolist()
    if bad_tickers:
        raise HTTPException(
            status_code=422,
            detail=f"Could not fetch market data for: {bad_tickers}. Check the ticker symbols and try again."
        )

    df["TotalValue"] = df["QuantityHeld"] * df["CurrentPrice"]
    df["UnrealizedGainLoss"] = (df["CurrentPrice"] - df["AveragePurchasePrice"]) * df["QuantityHeld"]
    df["Currency"] = "USD"
    df["AssetType"] = "Stock"

    records = df.to_dict(orient="records")

    async with database.transaction():
        snapshot_query = investment_snapshots.insert().values(description="No description", user_id=user_id)
        snapshot_id = await database.execute(snapshot_query)

        for record in records:
            record["snapshot_id"] = snapshot_id
        await database.execute_many(query=investments.insert(), values=records)

    return {
        "message": "Uploaded investment snapshot",
        "snapshot_id": snapshot_id,
        "records_inserted": len(records)
    }