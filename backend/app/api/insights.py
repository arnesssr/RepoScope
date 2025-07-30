"""
Insights API
Handles endpoints related to advanced insights and predictions.
"""

from fastapi import APIRouter, HTTPException
from ..services.ai.nlp_service import NLPService
from ..services.ai.prediction_service import PredictionService

router = APIRouter()

@router.get("/predictions")
async def get_predictions(repo_name: str):
    """Fetch and return predictions for the given repository"""
    # Example logic
    predictions = NLPService().analyze_commit_messages(repo_name)
    return {"predictions": predictions}

@router.get("/trends")
async def get_trends(repo_name: str):
    """Fetch and return trends analysis for the given repository"""
    # Example logic
    trends = NLPService().analyze_commit_messages(repo_name)
    return {"trends": trends}

@router.get("/contributor-insights")
async def get_contributor_insights(repo_name: str):
    """Fetch and return contributor insights for the given repository"""
    # Example logic
    insights = PredictionService().predict_risks(repo_name)
    return {"contributor_insights": insights}
