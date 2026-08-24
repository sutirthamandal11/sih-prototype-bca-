from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models.schemas import UserResponse, UserRole, TrainerWithLearners, LearnerProgressDetail
from app.services.auth_service import get_current_user, require_role
from app.services.db import get_trainer_with_learners, get_learner_progress_detail

router = APIRouter(prefix="/trainer", tags=["Trainer Management"])

@router.get("/learners", response_model=TrainerWithLearners)
def get_my_learners_and_progress(
    current_user: UserResponse = Depends(require_role([UserRole.TRAINER, UserRole.MANAGER, UserRole.ADMIN]))
):
    """
    Returns the list of learners enrolled under this trainer,
    including their progress percentage, current content module position, and skill assessment levels.
    """
    # If admin or manager is viewing as a trainer fallback, use trainer-1 by default
    trainer_id = current_user.id if current_user.role == UserRole.TRAINER else "trainer-1"
    trainer_view = get_trainer_with_learners(trainer_id)
    if not trainer_view:
        raise HTTPException(status_code=404, detail="Trainer profile not found")
    return trainer_view

@router.get("/learner/{learner_id}", response_model=LearnerProgressDetail)
def get_specific_learner_drilldown(
    learner_id: str,
    current_user: UserResponse = Depends(require_role([UserRole.TRAINER, UserRole.MANAGER, UserRole.ADMIN]))
):
    """Get in-depth progress, module positions, and skill assessment history for a specific learner."""
    lp = get_learner_progress_detail(learner_id)
    if not lp:
        raise HTTPException(status_code=404, detail="Learner not found")
    return lp
