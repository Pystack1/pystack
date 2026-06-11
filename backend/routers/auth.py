from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List

from backend.models.user import User
from backend.schemas.auth import (
    RegisterRequest, 
    LoginRequest, 
    TokenResponse, 
    UserRead, 
    UserUpdate,
    CreateAdminRequest
)
from backend.services.auth_service import (
    create_user, 
    authenticate_user, 
    create_tokens_for_user,
    update_user_status, 
    get_all_users, 
    delete_user
)
from backend.security.jwt import get_current_user, get_current_admin_or_superadmin, get_current_superadmin
from backend.database import get_db

router = APIRouter( tags=["Auth"])

# ==========================
# 1. REGISTER
# ==========================
@router.post("/register", status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.exec(select(User).where(User.email == data.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = create_user(db, data.email, data.password, data.full_name)
    
    return {
        "message": "Registration successful! Please wait for Admin approval.",
        "user": UserRead.from_orm(user) # FIXED: V1 Syntax
    }

# ==========================
# 2. LOGIN
# ==========================
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user, error_msg = authenticate_user(db, data.email, data.password)
    
    if error_msg:
        raise HTTPException(
            status_code=401, 
            detail=error_msg
        )
    
    tokens = create_tokens_for_user(user, db)
    return TokenResponse(**tokens)

# ==========================
# 3. GET CURRENT USER
# ==========================
@router.get("/me", response_model=UserRead)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return UserRead.from_orm(current_user) # FIXED: V1 Syntax

# ==========================
# 4. LIST ALL USERS
# ==========================
@router.get("/users", response_model=List[UserRead])
def get_users(
    db: Session = Depends(get_db), 
    _=Depends(get_current_admin_or_superadmin)
):
    users = get_all_users(db)
    return [UserRead.from_orm(u) for u in users] # FIXED: V1 Syntax

# ==========================
# 5. UPDATE USER STATUS/ROLES
# ==========================
@router.put("/users/{user_id}", response_model=UserRead)
def update_user(
    user_id: int, 
    data: UserUpdate, 
    db: Session = Depends(get_db), 
    _=Depends(get_current_admin_or_superadmin)
):
    updated_user = update_user_status(db, user_id, data.is_active, data.roles)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return UserRead.from_orm(updated_user) # FIXED: V1 Syntax

# ==========================
# 6. DELETE USER
# ==========================
@router.delete("/users/{user_id}")
def delete_user_route(
    user_id: int, 
    db: Session = Depends(get_db), 
    _=Depends(get_current_superadmin)
):
    success = delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

# ==========================
# 7. CREATE ADMIN
# ==========================
@router.post("/create-admin", response_model=UserRead)
def create_admin_route(
    data: CreateAdminRequest, 
    db: Session = Depends(get_db), 
    _=Depends(get_current_superadmin)
):
    user = create_user(db, data.email, data.password, data.full_name, role_name="Admin")
    
    return UserRead.from_orm(user) # FIXED: V1 Syntax