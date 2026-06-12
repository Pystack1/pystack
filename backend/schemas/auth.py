from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class UserRead(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    is_active: bool
    roles: List[str] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

    @staticmethod
    def from_orm(obj):
        data = obj.dict() if hasattr(obj, 'dict') else {k: getattr(obj, k) for k in obj.__dict__ if not k.startswith('_')}
        if hasattr(obj, 'roles') and obj.roles:
            data['roles'] = [role.name for role in obj.roles if hasattr(role, 'name')]
        return UserRead(**data)

class UserUpdate(BaseModel):
    is_active: bool
    roles: List[str]

class CreateAdminRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

# ==================== NEW ====================
class AdminUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None