from typing import Optional

from sqlmodel import Field, SQLModel


class Course(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    title: str
    
    description: str
    
    skills: str
    
    duration: str = Field(default="")

    price: float = Field(default=0.0)

    published: bool = Field(default=True)