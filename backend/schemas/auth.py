from pydantic import BaseModel, EmailStr
from typing import List, Optional


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
    full_name: Optional[str]
    is_active: bool
    roles: List[str] = []

    # Use this for Pydantic V1
    class Config:
        orm_mode = True


class UserApproval(BaseModel):
    user_id: int
    is_active: bool
    roles: List[str]