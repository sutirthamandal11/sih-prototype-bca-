from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from app.models.schemas import UserResponse, UserRole, LearnerProgressDetail, ContentEnrollmentProgress
from app.services.auth_service import get_current_user
from app.services.db import get_learner_progress_detail, ENROLLMENTS_DB, TOPICS_DB

router = APIRouter(prefix="/progress", tags=["Learner Progress"])

@router.get("/my", response_model=LearnerProgressDetail)
def get_my_learning_progress(current_user: UserResponse = Depends(get_current_user)):
    """Returns the logged-in learner's enrolled topics, current content position, and assessment metrics."""
    lp = get_learner_progress_detail(current_user.id)
    if not lp:
        # If user is not yet enrolled or has no progress record, create a basic view
        enrollments = list(ENROLLMENTS_DB.get(current_user.id, {}).values())
        return LearnerProgressDetail(
            learner=current_user,
            trainer=None,
            enrollments=enrollments,
            overall_progress=0,
            completed_courses_count=0,
            in_progress_courses_count=0
        )
    return lp

@router.post("/enroll/{topic_id}")
def enroll_in_topic(topic_id: str, current_user: UserResponse = Depends(get_current_user)):
    """Allows a learner to enroll in a new topic."""
    topic = TOPICS_DB.get(topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
        
    user_enrs = ENROLLMENTS_DB.setdefault(current_user.id, {})
    if topic_id in user_enrs:
        return {"message": "Already enrolled", "enrollment": user_enrs[topic_id]}
        
    first_mod = topic.modules[0] if topic.modules else None
    mod_progress = [
        {"module_id": m.id, "module_title": m.title, "status": "in_progress" if idx == 0 else "locked"}
        for idx, m in enumerate(topic.modules)
    ]
    
    new_enr = ContentEnrollmentProgress(
        enrollment_id=f"enr-{current_user.id[:4]}-{topic_id[:4]}",
        topic_id=topic.id,
        topic_title=topic.title,
        category=topic.category,
        total_modules=topic.total_modules,
        completed_modules_count=0,
        current_module_id=first_mod.id if first_mod else "mod-1",
        current_module_title=f"Module 1: {first_mod.title}" if first_mod else "Module 1",
        progress_percentage=0,
        status="in_progress",
        last_accessed="Just now",
        modules=mod_progress
    )
    user_enrs[topic_id] = new_enr
    return {"message": "Successfully enrolled", "enrollment": new_enr}
