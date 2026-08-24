from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import Topic
from app.services.db import TOPICS_DB

router = APIRouter(prefix="/topics", tags=["Topics & Curriculum"])

@router.get("", response_model=List[Topic])
def list_topics():
    """Returns available topics/courses."""
    return list(TOPICS_DB.values())

@router.get("/{topic_id}", response_model=Topic)
def get_topic_details(topic_id: str):
    topic = TOPICS_DB.get(topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic
