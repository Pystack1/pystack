from typing import List
from datetime import datetime
from sqlmodel import Session, select

from backend.database import engine
from backend.models.enquiry import Enquiry
from backend.models.course import Course
from backend.schemas.enquiry import EnquiryRead  # <-- Import the Pydantic schema



def create_enquiry(enquiry: Enquiry) -> Enquiry:
    with Session(engine) as session:
        if enquiry.created_at is None:
            enquiry.created_at = datetime.utcnow()
        
        session.add(enquiry)
        session.commit()
        session.refresh(enquiry)
        return enquiry


def list_enquiries() -> List[EnquiryRead]:  # <-- Return EnquiryRead, not Enquiry
    with Session(engine) as session:
        statement = select(Enquiry)
        enquiries = session.exec(statement).all()
        
        result = []
        for enquiry in enquiries:
            course_title = None
            if enquiry.course_id:
                course = session.get(Course, enquiry.course_id)
                course_title = course.title if course else "Unknown Course"
            
            # Build EnquiryRead Pydantic model (not SQLModel)
            result.append(EnquiryRead(
                id=enquiry.id,
                name=enquiry.name,
                email=enquiry.email,
                message=enquiry.message,
                mobile=enquiry.mobile,
                course_id=enquiry.course_id,
                course_title=course_title,
                created_at=enquiry.created_at,
            ))
        
        return result


def delete_enquiry(enquiry_id: int) -> bool:
    with Session(engine) as session:
        enquiry = session.get(Enquiry, enquiry_id)
        if not enquiry:
            return False
        session.delete(enquiry)
        session.commit()
        return True