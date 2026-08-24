from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from app.models.schemas import UserResponse, UserRole, AdminSystemOverview
from app.services.auth_service import get_current_user, require_role
from app.services.db import get_admin_overview, USERS_DB

router = APIRouter(prefix="/admin", tags=["Administrator Oversight"])

@router.get("/overview", response_model=AdminSystemOverview)
def get_admin_global_overview(
    current_user: UserResponse = Depends(require_role([UserRole.ADMIN]))
):
    """
    Returns master system overview:
    All managers, trainers, learners, courses, active assessments, and organizational performance metrics.
    """
    return get_admin_overview()

@router.get("/users")
def list_all_system_users(
    current_user: UserResponse = Depends(require_role([UserRole.ADMIN]))
):
    """List all registered users in the organization with their roles and assignment hierarchy."""
    return [
        {
            "id": u["id"],
            "name": u["name"],
            "email": u["email"],
            "role": u["role"].value,
            "department": u["department"],
            "trainer_id": u.get("trainer_id")
        }
        for u in USERS_DB.values()
    ]
