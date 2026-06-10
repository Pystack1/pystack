from typing import List

from sqlmodel import Session

from backend.database import engine
from backend.models.enquiry import Enquiry


def create_enquiry(enquiry: Enquiry) -> Enquiry:
    with Session(engine) as session:
        session.add(enquiry)
        session.commit()
        session.refresh(enquiry)
        return enquiry

from sqlmodel import Session, select

def list_enquiries() -> List[Enquiry]:
    with Session(engine) as session:
        statement = select(Enquiry)
        return session.exec(statement).all()

from typing import Optional
from sqlmodel import Session

def delete_enquiry(enquiry_id: int) -> bool:
    with Session(engine) as session:
        enquiry = session.get(Enquiry, enquiry_id)

        if not enquiry:
            return False

        session.delete(enquiry)
        session.commit()

        return True