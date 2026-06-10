from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from backend.models.user import User

from backend.database import get_db
from backend.schemas.auth import (
    RegisterRequest, 
    LoginRequest, 
    TokenResponse, 
    UserRead, 
    UserApproval
)
from backend.services.auth_service import (
    create_user, 
    authenticate_user, 
    create_tokens_for_user,
    approve_user, 
    get_all_pending_users, 
    get_user_by_email
)
from backend.security.jwt import (
    get_current_user,
    get_current_superadmin, 
    get_current_admin_or_superadmin
)

router = APIRouter( tags=["auth"])

@router.post("/register", response_model=UserRead)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    user = create_user(db, data.email, data.password, data.full_name)

    return UserRead(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        roles=[role.name for role in user.roles]
    )


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, data.email, data.password)
    if not user:
        raise HTTPException(
            status_code=401, 
            detail="Invalid credentials or account not approved yet"
        )
    
    tokens = create_tokens_for_user(user)
    return TokenResponse(**tokens)


@router.get("/pending-users", response_model=List[UserRead])
def get_pending_users(db: Session = Depends(get_db), _=Depends(get_current_admin_or_superadmin)):
    users = get_all_pending_users(db)
    return [
    UserRead(
        id=u.id,
        email=u.email,
        full_name=u.full_name,
        is_active=u.is_active,
        roles=[role.name for role in u.roles]
    )
    for u in users
]


@router.post("/approve-user", response_model=UserRead)
def approve_user_route(data: UserApproval, db: Session = Depends(get_db), _=Depends(get_current_superadmin)):
    approved_user = approve_user(db, data.user_id, data.is_active, data.roles)
    if not approved_user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserRead(
    id=approved_user.id,
    email=approved_user.email,
    full_name=approved_user.full_name,
    is_active=approved_user.is_active,
    roles=[role.name for role in approved_user.roles]
)

@router.get("/me", response_model=UserRead)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return UserRead(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        roles=[role.name for role in current_user.roles]
    )