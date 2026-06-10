from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from backend.models.course import Course
from backend.schemas.course import CourseCreate, CourseRead
from backend.security.jwt import get_current_admin_or_superadmin   # ← Updated
from backend.services.course_service import (
    create_course, get_course, list_courses, update_course, delete_course
)

router = APIRouter(tags=["courses"])


@router.get("/", response_model=List[CourseRead])
def get_courses():
    """Public route - Anyone can see courses"""
    return list_courses()


@router.get("/{course_id}", response_model=CourseRead)
def get_course_by_id(course_id: int):
    course = get_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.post("/", response_model=CourseRead, status_code=status.HTTP_201_CREATED)
def create_course_route(
    course_in: CourseCreate,
    user=Depends(get_current_admin_or_superadmin)   # ← Protected
):
    course = Course.from_orm(course_in) if hasattr(course_in, "dict") else course_in
    return create_course(course)


@router.put("/{course_id}", response_model=CourseRead)
def update_course_route(
    course_id: int,
    course_in: CourseCreate,
    user=Depends(get_current_admin_or_superadmin)
):
    updated_course = update_course(course_id, course_in.dict() if hasattr(course_in, "dict") else course_in)
    if not updated_course:
        raise HTTPException(status_code=404, detail="Course not found")
    return updated_course


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course_route(
    course_id: int,
    user=Depends(get_current_admin_or_superadmin)
):
    deleted = delete_course(course_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Course not found")