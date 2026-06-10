from typing import Optional
from pydantic import BaseModel


class CourseCreate(BaseModel):
    title: str
    description: str
    duration: str
    skills: str
    price: float
    published: bool = True


class CourseRead(BaseModel):
    id: int
    title: str
    description: str
    duration: str
    skills: str
    price: float
    published: bool

    class Config:
        orm_mode = True