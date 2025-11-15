from fastapi import APIRouter, Form
import json

from database import database
from models import surveys

router = APIRouter(prefix="/upload-survey")

@router.post("/")
async def upload_survey(surveyAnswers: str = Form(...)):
    # Handle survey data
    # surveyAnswers is a form containing FOUR integers
    survey_data = json.loads(surveyAnswers)
    print(survey_data)
    query = surveys.insert().values(
        riskTolerance = survey_data.get("riskTolerance"),
        investmentHorizon = survey_data.get("investmentHorizon"),
        lossCapacity = survey_data.get("lossCapacity"),
        investmentGoal = survey_data.get("investmentGoal"),
    )
    survey_id = await database.execute(query)

    return {
        "message": "Uploaded survey info",
        "survey_id": survey_id,
        "survey": survey_data,
    }
