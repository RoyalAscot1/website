from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import io
import json

app = FastAPI(title="Investment Advisor API")

# React frontend
origins = ["http://localhost:3000", "https://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Mock database: CHANGE LATER
SURVEYS = []
RECOMMENDATIONS = [
    "A, B, C",
    "D, E, F",
    "G, H, I"
]

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

# Survey format
class Survey(BaseModel): # keep surveys a simple string for now
    content: str

# Post surveys about user recommendation
@app.post("/survey")
async def submit_survey(survey: Survey):
    survey_id = len(SURVEYS)
    entry = {"id": survey_id, "content": survey}
    SURVEYS.append(entry)
    return {"survey_id": survey_id, "summary": entry}

# Get recommendations depending on input factors
@app.get("/recommendations")
async def get_recommendations(risk: str): # keep risk a simple string for now
    # write logic to decide recommendations + recommendation format later
    if risk == "low":
        recommendation = RECOMMENDATIONS[0]
    elif risk == "medium":
        recommendation = RECOMMENDATIONS[1]
    elif risk == "high":
        recommendation = RECOMMENDATIONS[2]
    else:
        recommendation = "Invalid risk value"

    return {"recommendation": recommendation}
