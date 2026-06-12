from typing import Optional
from pydantic import BaseModel, EmailStr, validator
from datetime import datetime


class EnquiryCreate(BaseModel):
    name: str
    email: EmailStr
    message: str
    mobile: str
    course_id: Optional[int] = None
    created_at: Optional[datetime] = None

    @validator('mobile')
    def validate_mobile(cls, v):
        if len(v) != 10:
            raise ValueError("Mobile number must be 10 digits")
        return v


class EnquiryRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    message: str
    mobile: str  # <-- Added
    course_id: Optional[int]
    course_title: Optional[str] = None  # <-- Added
    created_at: datetime

    class Config:
        orm_mode = True