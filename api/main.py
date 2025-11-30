import os
import json
import pandas as pd
from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware

# Import Gemini
from google import genai
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Import analyze function
from routers.analyze import analyze_snapshot

# Import PostgreSQL database
from database import database, engine, metadata
from models import surveys

# Routers
from routers.upload_csv import router as upload_csv_router
from routers.upload_survey import router as upload_survey_router
from routers.snapshots import router as snapshots_router
from routers.analyze import router as analyze_router

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

app.include_router(upload_csv_router)
app.include_router(upload_survey_router)
app.include_router(snapshots_router)
app.include_router(analyze_router)

@app.get("/")
async def root():
    return {"message": "API online"}

@app.post("/recommendations")
async def recommendations(input: str = Form(...)):
    client = genai.Client(api_key=GEMINI_API_KEY)

    input_data = json.loads(input)
    print(input_data)
    snapshot_id = input_data.get("snapshotId")
    survey_id = input_data.get("surveyId")
    print(survey_id)

    analytics = await analyze_snapshot(snapshot_id)

    query = surveys.select().where(surveys.c.id == survey_id)
    survey = await database.fetch_one(query)
    print(survey)
    
    if not survey:
        return {"error": f"Survey with id {survey_id} not found"}
    
    survey_dict = dict(survey)
    survey_json = json.dumps(survey_dict)

    prompt = f"""
You are an investment advisor. Given the following computed portfolio analytics and 
the user's risk score, produce a human-readable explanation and recommendations.

Analytics:
{json.dumps(analytics, indent=2)}

User survey:
{json.dumps(survey_json, indent=2)}

Explain:
- Key strengths of the portfolio
- Key risks
- Whether current allocation fits the user’s risk profile
- Actions the user should take: reduce what, increase what, rebalance, etc.

Output (brief paragraph for each except Recommendations, which should be 4 bullet points):

Key strengths:
Key risks:
Does your portfolio fit your profile?
Recommendations:
Do not add any text after your last recommendation.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return {"gemini_response": response.text}

# Unused endpoints
# ================

# Import data schemas - used only with direct data injections
# from schemas import InvestmentIn, SurveyIn

# @app.post("/investments/")
# async def create_investment(investment: InvestmentIn):
#    query = investments.insert().values(**investment.dict())
#    record_id = await database.execute(query)
#    return {**investment.dict(), "id": record_id}

# @app.get("/investments/")
# async def get_investments():
#    query = investments.select()
#    return await database.fetch_all(query)

# @app.post("/surveys/")
# async def create_survey(survey: SurveyIn):
#    query = surveys.insert().values(**survey.dict())
#    record_id = await database.execute(query)
#    return {**survey.dict(), "id": record_id}

# @app.get("/surveys/")
# async def get_surveys():
#    query = surveys.select()
#    return await database.fetch_all(query)
