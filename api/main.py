from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import io
import json

# Import PostgreSQL database
from database import database, engine, metadata
from models import investments, surveys
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

@app.post("/upload")
async def upload_data(file: UploadFile = File(...),
                      surveyAnswers: str = Form(...)):
    # surveyAnswers is a form containing TWO strings, riskTolerance and investmentHorizon
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    print(df)

    survey_data = json.loads(surveyAnswers)
    print(survey_data)
    riskTolerance = survey_data.get("riskTolerance")
    investmentHorizon = survey_data.get("investmentHorizon")
    query = surveys.insert().values(
        riskTolerance=riskTolerance,
        investmentHorizon=investmentHorizon
    )
    survey_id = await database.execute(query)

    return {
        "message": "Inserted survey data ONLY",
        "file": file,
        "survey_id": survey_id,
        "survey": survey_data,
    }

@app.post("/investments/")
async def create_investment(investment: InvestmentIn):
    query = investments.insert().values(**investment.dict())
    record_id = await database.execute(query)
    return {**investment.dict(), "id": record_id}

@app.get("/investments/")
async def get_investments():
    query = investments.select()
    return await database.fetch_all(query)

@app.post("/surveys/")
async def create_survey(survey: SurveyIn):
    query = surveys.insert().values(**survey.dict())
    record_id = await database.execute(query)
    return {**survey.dict(), "id": record_id}

@app.get("/surveys/")
async def get_surveys():
    query = surveys.select()
    return await database.fetch_all(query)
