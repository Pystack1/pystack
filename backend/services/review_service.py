from sqlmodel import Session
from typing import List
from backend.models.review import Review

def list_reviews(db: Session) -> List[Review]:
    return db.query(Review).all()   # or db.exec(select(Review)).all()

def create_review(review_data: dict, db: Session):
    db_review = Review(**review_data)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review