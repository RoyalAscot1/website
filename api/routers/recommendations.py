from fastapi import APIRouter, Depends, Form, HTTPException
from auth import get_current_user
from database import database
from models import investment_snapshots, surveys
import os
import json

from google import genai
from google.genai import errors as genai_errors

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
_gemini_client = genai.Client(api_key=GEMINI_API_KEY)

from routers.analyze import analyze_snapshot

router = APIRouter(prefix="/recommendations")


@router.post("/")
async def recommendations(input: str = Form(...), user_id: str = Depends(get_current_user)):
    input_data = json.loads(input)
    snapshot_id = input_data.get("snapshotId")
    survey_id = input_data.get("surveyId")

    snap = await database.fetch_one(
        investment_snapshots.select().where(
            investment_snapshots.c.id == snapshot_id,
            investment_snapshots.c.user_id == user_id,
        )
    )
    if not snap:
        raise HTTPException(status_code=404, detail="Snapshot not found")

    survey = await database.fetch_one(
        surveys.select().where(
            surveys.c.id == survey_id,
            surveys.c.user_id == user_id,
        )
    )
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")

    analytics = await analyze_snapshot(snapshot_id)
    survey_dict = dict(survey)

    prompt = f"""
You are an investment advisor. Given the following computed portfolio analytics and
the user's risk score, produce a human-readable explanation and recommendations.

Analytics:
{json.dumps(analytics, indent=2)}

User survey:
{json.dumps(survey_dict, indent=2)}

Explain:
- Key strengths of the portfolio
- Key risks
- Whether current allocation fits the user's risk profile
- Actions the user should take: reduce what, increase what, rebalance, etc.

Output (brief paragraph for each except Recommendations, which should be 4 bullet points):

Key strengths:
Key risks:
Does your portfolio fit your profile?
Recommendations:
Do not add any text after your last recommendation.
"""

    try:
        response = _gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
    except genai_errors.ClientError as e:
        raise HTTPException(status_code=502, detail=f"Gemini API error: {e.message}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error calling Gemini: {str(e)}")

    return {"gemini_response": response.text}
