from fastapi import APIRouter, HTTPException, Depends, status
from app.models.schemas import LoginRequest, TokenResponse, UserResponse, UserRole
from app.services.db import USERS_DB, get_user_by_email, get_user_by_id
from app.services.auth_service import verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    user_data = get_user_by_email(req.email)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or user not found.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verify_password(req.password, user_data.get("password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password. For demo, use 'password123'.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(data={"sub": user_data["id"], "role": user_data["role"].value})
    user_resp = UserResponse(**{k: v for k, v in user_data.items() if k != "password"})
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_resp
    )

@router.get("/me", response_model=UserResponse)
def get_current_logged_in_user(current_user: UserResponse = Depends(get_current_user)):
    return current_user

@router.get("/demo-users")
def get_demo_users():
    """Returns pre-configured demo users across all 4 roles for instant one-click login in the UI."""
    return [
        {
            "id": u["id"],
            "name": u["name"],
            "email": u["email"],
            "role": u["role"].value,
            "department": u["department"],
            "avatar": u.get("avatar"),
            "description": (
                "Full organizational governance & catalog oversight" if u["role"] == UserRole.ADMIN
                else "Monitors trainers, aggregate cohorts & completion metrics" if u["role"] == UserRole.MANAGER
                else f"Tracks enrolled learners in {', '.join(u.get('specializations', ['Assigned topics']))}" if u["role"] == UserRole.TRAINER
                else "Enrolled in content, takes AI diagnostic tests & tracks position"
            )
        }
        for u in USERS_DB.values()
    ]
