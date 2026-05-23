from fastapi import APIRouter, Form, HTTPException
from database import database
from models import surveys
import os
import json

from google import genai
from google.genai import errors as genai_errors
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Import analyze function
from routers.analyze import analyze_snapshot

router = APIRouter(prefix="/recommendations")

@router.post("/")
async def recommendations(input: str = Form(...)):
    client = genai.Client(api_key=GEMINI_API_KEY)

    input_data = json.loads(input)
    print(input_data)
    snapshot_id = input_data.get("snapshotId")
    survey_id = input_data.get("surveyId")

    analytics = await analyze_snapshot(snapshot_id)

    query = surveys.select().where(surveys.c.id == survey_id)
    survey = await database.fetch_one(query)
    
    if not survey:
        raise HTTPException(status_code=404, detail=f"Survey {survey_id} not found")
    
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

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
    except genai_errors.ClientError as e:
        raise HTTPException(status_code=502, detail=f"Gemini API error: {e.message}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error calling Gemini: {str(e)}")

    return {"gemini_response": response.text}