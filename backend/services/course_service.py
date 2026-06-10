from typing import List, Optional

from sqlmodel import Session, select

from backend.database import engine
from backend.models.course import Course


def create_course(course: Course) -> Course:
    with Session(engine) as session:
        session.add(course)
        session.commit()
        session.refresh(course)
        return course


def get_course(course_id: int) -> Optional[Course]:
    with Session(engine) as session:
        return session.get(Course, course_id)


def list_courses() -> List[Course]:
    with Session(engine) as session:
        statement = select(Course)
        return session.exec(statement).all()


def delete_course(course_id: int) -> bool:
    with Session(engine) as session:
        course = session.get(Course, course_id)

        if not course:
            return False

        session.delete(course)
        session.commit()

        return True


def update_course(course_id: int, course_data: dict) -> Optional[Course]:
    with Session(engine) as session:
        course = session.get(Course, course_id)

        if not course:
            return None

        for key, value in course_data.items():
            setattr(course, key, value)

        session.add(course)
        session.commit()
        session.refresh(course)

        return course