from typing import Optional

from pydantic import BaseModel, EmailStr

from datetime import datetime


class EnquiryCreate(BaseModel):
    name: str
    email: EmailStr
    message: str
    course_id: Optional[int] = None
    created_at: datetime


class EnquiryRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    message: str
    course_id: Optional[int]
    created_at: datetime

    class Config:
        orm_mode = True
