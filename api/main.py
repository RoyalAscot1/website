from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import io
import json

# Import PostgreSQL database
from database import database, engine, metadata
from models import investments
metadata.create_all(engine)

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

@app.post("/upload")
async def upload_data(file: UploadFile = File(...),
                      surveyAnswers: str = Form(...)):
    # surveyAnswers is a form containing TWO strings, riskTolerance and investmentHorizon
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    print(df)

    survey_data = json.loads(surveyAnswers)
    print(survey_data)

    return {
        "message": "200 OK",
        "file": file,
        "survey": survey_data,
    }

class InvestmentIn(BaseModel):
    name: str
    risk_level: str
    expected_return: float

@app.post("/investments/")
async def create_investment(investment: InvestmentIn):
    query = investments.insert().values(**investment.dict())
    record_id = await database.execute(query)
    return {**investment.dict(), "id": record_id}

@app.get("/investments/")
async def get_investments():
    query = investments.select()
    return await database.fetch_all(query)
