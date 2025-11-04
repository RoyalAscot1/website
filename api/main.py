from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import json
import yfinance as yf

# Import PostgreSQL database
from database import database, engine, metadata
from models import investment_snapshots, investments, surveys
metadata.create_all(engine)

# Import data schemas
from schemas import InvestmentIn, SurveyIn

app = FastAPI(title="Investment Advisor API")

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

# React frontend
origins = ["http://localhost:3000", "https://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
async def root():
    return {"message": "API online"}

# Yahoo Finance helper functions
def get_investment_name(ticker):
    try:
        stock = yf.Ticker(ticker) 
        info = stock.info
        return info.get("shortName") or info.get("longName") or ticker
    except Exception:
        return ticker

def get_current_price(ticker):
    try:
        stock = yf.Ticker(ticker) 
        info = stock.info
        return info.get("regularMarketPrice") or info.get("previousClose")
    except Exception:
        return None

@app.post("/upload-CSV")
async def upload_csv(file: UploadFile = File(...)):
    # Handle CSV of investment snapshot
    # CSV upload format: TickerSymbol, QuantityHeld, AveragePurchasePrice
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    df["InvestmentName"] = df["TickerSymbol"].apply(get_investment_name)
    df["CurrentPrice"] = df["TickerSymbol"].apply(get_current_price)
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

@app.post("/upload-survey")
async def upload_survey(surveyAnswers: str = Form(...)):
    # Handle survey data
    # surveyAnswers is a form containing TWO strings, riskTolerance and investmentHorizon
    survey_data = json.loads(surveyAnswers)
    print(survey_data)
    riskTolerance = survey_data.get("riskTolerance")
    investmentHorizon = survey_data.get("investmentHorizon")
    query = surveys.insert().values(riskTolerance=riskTolerance, investmentHorizon=investmentHorizon)
    survey_id = await database.execute(query)

    return {
        "message": "Uploaded survey info",
        "survey_id": survey_id,
        "survey": survey_data,
    }

# @app.post("/investments/")
# async def create_investment(investment: InvestmentIn):
#    query = investments.insert().values(**investment.dict())
#    record_id = await database.execute(query)
#    return {**investment.dict(), "id": record_id}

@app.get("/snapshots/")
async def get_snapshots():
    query = investment_snapshots.select().order_by(investment_snapshots.c.uploaded_at.desc())
    return await database.fetch_all(query)

@app.get("/snapshots/{snapshot_id}")
async def get_snapshot_investments(snapshot_id: int):
    query = investments.select().where(investments.c.snapshot_id == snapshot_id)
    return await database.fetch_all(query)

# @app.get("/investments/")
# async def get_investments():
#    query = investments.select()
#    return await database.fetch_all(query)

# @app.post("/surveys/")
# async def create_survey(survey: SurveyIn):
#    query = surveys.insert().values(**survey.dict())
#    record_id = await database.execute(query)
#    return {**survey.dict(), "id": record_id}

@app.get("/surveys/")
async def get_surveys():
    query = surveys.select()
    return await database.fetch_all(query)
