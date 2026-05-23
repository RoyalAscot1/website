from fastapi import APIRouter, Depends, Form, HTTPException
import json
from pydantic import BaseModel, Field

from auth import get_current_user
from database import database
from models import surveys


class SurveyIn(BaseModel):
    riskTolerance: int = Field(..., ge=1, le=3)
    investmentHorizon: int = Field(..., ge=1, le=3)
    lossCapacity: int = Field(..., ge=1, le=3)
    investmentGoal: int = Field(..., ge=1, le=3)


router = APIRouter(prefix="/upload-survey")

@router.post("/")
async def upload_survey(surveyAnswers: str = Form(...), user_id: str = Depends(get_current_user)):
    try:
        raw = json.loads(surveyAnswers)
    except json.JSONDecodeError:
        raise HTTPException(status_code=422, detail="surveyAnswers must be valid JSON")

    survey = SurveyIn.model_validate(raw)

    query = surveys.insert().values(
        user_id=user_id,
        riskTolerance=survey.riskTolerance,
        investmentHorizon=survey.investmentHorizon,
        lossCapacity=survey.lossCapacity,
        investmentGoal=survey.investmentGoal,
    )
    survey_id = await database.execute(query)

    return {
        "message": "Uploaded survey info",
        "survey_id": survey_id,
        "survey": survey.model_dump(),
    }
