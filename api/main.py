from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import PostgreSQL database
from database import database, engine, metadata

# Routers
from routers.upload_csv import router as upload_csv_router
from routers.upload_survey import router as upload_survey_router
from routers.snapshots import router as snapshots_router
from routers.analyze import router as analyze_router
from routers.recommendations import router as recommendations_router

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
app.include_router(recommendations_router)

@app.get("/")
async def root():
    return {"message": "API online"}

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
