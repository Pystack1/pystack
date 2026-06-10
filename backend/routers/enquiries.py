from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from backend.models.enquiry import Enquiry
from backend.schemas.enquiry import EnquiryCreate, EnquiryRead
from backend.security.jwt import get_current_admin_or_superadmin   # ← Updated
from backend.services.enquiry_service import create_enquiry, list_enquiries, delete_enquiry

router = APIRouter(tags=["enquiries"])


@router.post("/", response_model=EnquiryRead, status_code=status.HTTP_201_CREATED)
def submit_enquiry(enquiry_in: EnquiryCreate):
    """Public route - Anyone can submit enquiry"""
    enquiry = Enquiry.from_orm(enquiry_in) if hasattr(enquiry_in, "dict") else enquiry_in
    return create_enquiry(enquiry)


@router.get("/", response_model=List[EnquiryRead])
def read_enquiries(user=Depends(get_current_admin_or_superadmin)):   # ← Protected
    return list_enquiries()


@router.delete("/{enquiry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_enquiry_route(
    enquiry_id: int,
    user=Depends(get_current_admin_or_superadmin)
):
    deleted = delete_enquiry(enquiry_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Enquiry not found")