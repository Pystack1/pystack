from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

# Import the dependency we just added
from backend.database import get_db

# Schemas
from backend.schemas.review import ReviewCreate, ReviewRead

# Services
from backend.services.review_service import list_reviews, create_review

router = APIRouter()


@router.get("/", response_model=List[ReviewRead])
def get_reviews(db: Session = Depends(get_db)) -> List[ReviewRead]:
    """
    Public route to fetch all reviews.
    Uses get_db() dependency which creates the session.
    """
    return list_reviews(db)

@router.post("/", response_model=ReviewRead, status_code=201)
def add_review_route(review_in: ReviewCreate, db: Session = Depends(get_db)):
    new_review = create_review(review_in.dict(), db)   # keep this
    if not new_review:
        raise HTTPException(status_code=500, detail="Could not create review")
    return new_review