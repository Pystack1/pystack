from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Review(SQLModel, table=True):
    __tablename__ = "reviews"   # Make sure it matches table name

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    role: str                     # ← Changed
    text: str                     # ← Changed (was comment)
    rating: int = Field(ge=1, le=5)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)