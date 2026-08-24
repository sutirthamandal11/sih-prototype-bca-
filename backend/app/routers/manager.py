from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import UserResponse, UserRole, ManagerHierarchyView
from app.services.auth_service import get_current_user, require_role
from app.services.db import get_manager_hierarchy

router = APIRouter(prefix="/manager", tags=["Training Manager Dashboard"])

@router.get("/trainers-and-learners", response_model=ManagerHierarchyView)
def get_manager_organization_hierarchy(
    current_user: UserResponse = Depends(require_role([UserRole.MANAGER, UserRole.ADMIN]))
):
    """
    Returns full training manager view:
    All trainers, their assigned learners, and learner content positions & assessment scores.
    """
    return get_manager_hierarchy()
