from fastapi import APIRouter, Depends, Form
import json

from auth import get_current_user
from database import database
from models import surveys

router = APIRouter(prefix="/upload-survey")

@router.post("/")
async def upload_survey(surveyAnswers: str = Form(...), user_id: str = Depends(get_current_user)):
    survey_data = json.loads(surveyAnswers)
    query = surveys.insert().values(
        user_id=user_id,
        riskTolerance=survey_data.get("riskTolerance"),
        investmentHorizon=survey_data.get("investmentHorizon"),
        lossCapacity=survey_data.get("lossCapacity"),
        investmentGoal=survey_data.get("investmentGoal"),
    )
    survey_id = await database.execute(query)

    return {
        "message": "Uploaded survey info",
        "survey_id": survey_id,
        "survey": survey_data,
    }
