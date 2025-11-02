from pydantic import BaseModel

class InvestmentIn(BaseModel):
    name: str
    risk_level: str
    expected_return: float

class SurveyIn(BaseModel):
    riskTolerance: str
    investmentHorizon: str