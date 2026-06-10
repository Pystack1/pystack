from sqlmodel import SQLModel
from typing import Optional
from datetime import datetime

class ReviewBase(SQLModel):
    name: str
    role: str
    text: str
    rating: int

class ReviewCreate(ReviewBase):
    pass

class ReviewRead(ReviewBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True