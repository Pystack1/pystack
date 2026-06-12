from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional

from backend.models.user import User
from backend.schemas.auth import (
    RegisterRequest, 
    LoginRequest, 
    TokenResponse, 
    UserRead, 
    UserUpdate,
    CreateAdminRequest,
    AdminUpdateRequest
)
from backend.services.auth_service import (
    create_user, 
    create_admin,
    authenticate_user, 
    create_tokens_for_user,
    update_user_status, 
    get_all_users, 
    get_all_admins,
    update_admin,
    delete_user
)
from backend.security.jwt import get_current_user, get_current_admin_or_superadmin, get_current_superadmin
from backend.database import get_db

router = APIRouter(tags=["Auth"])

@router.post("/register", status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.exec(select(User).where(User.email == data.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = create_user(db, data.email, data.password, data.full_name)
    return {"message": "Registration successful! Please wait for Admin approval.", "user": UserRead.from_orm(user)}

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user, error_msg = authenticate_user(db, data.email, data.password)
    if error_msg:
        raise HTTPException(status_code=401, detail=error_msg)
    tokens = create_tokens_for_user(user, db)
    return TokenResponse(**tokens)

@router.get("/me", response_model=UserRead)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return UserRead.from_orm(current_user)

# ==================== USERS (approvals) ====================
@router.get("/users", response_model=List[UserRead])
def get_users(db: Session = Depends(get_db), _=Depends(get_current_admin_or_superadmin)):
    users = get_all_users(db)
    return [UserRead.from_orm(u) for u in users]

@router.put("/users/{user_id}", response_model=UserRead)
def update_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_or_superadmin)):
    target_user = db.get(User, user_id)
    if target_user:
        if any(role.name == "SuperAdmin" for role in target_user.roles):
            raise HTTPException(status_code=403, detail="SuperAdmin cannot be modified")
        if any(role.name == "Admin" for role in target_user.roles):
            raise HTTPException(status_code=403, detail="Admin cannot be modified here")
    updated_user = update_user_status(db, user_id, data.is_active, data.roles)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserRead.from_orm(updated_user)

# ==================== ADMINS (SuperAdmin only) ====================
@router.get("/admins", response_model=List[UserRead])
def get_admins(db: Session = Depends(get_db), _=Depends(get_current_superadmin)):
    admins = get_all_admins(db)
    return [UserRead.from_orm(u) for u in admins]

@router.post("/create-admin", response_model=UserRead)
def create_admin_route(data: CreateAdminRequest, db: Session = Depends(get_db), _=Depends(get_current_superadmin)):
    existing = db.exec(select(User).where(User.email == data.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = create_admin(db, data.email, data.password, data.full_name)
    return UserRead.from_orm(user)

@router.put("/admins/{user_id}", response_model=UserRead)
def update_admin_route(user_id: int, data: AdminUpdateRequest, db: Session = Depends(get_db), _=Depends(get_current_superadmin)):
    updated = update_admin(db, user_id, data.full_name, data.email, data.password)
    if not updated:
        raise HTTPException(status_code=404, detail="Admin not found")
    return UserRead.from_orm(updated)

@router.delete("/admins/{user_id}")
def delete_admin_route(user_id: int, db: Session = Depends(get_db), _=Depends(get_current_superadmin)):
    success = delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Admin not found")
    return {"message": "Admin deleted successfully"}