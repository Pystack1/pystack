from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Enquiry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    message: str
    course_id: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
