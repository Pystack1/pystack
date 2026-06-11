from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlmodel import Session
from typing import List

from backend.database import get_db
from backend.models.user import User
from backend.models.user_profile import UserProfile
from backend.schemas.user_profile import UserProfileRead, UserProfileUpdate
from backend.services.user_profile_service import get_profile_by_user_id, create_or_update_profile
from backend.security.jwt import get_current_user

router = APIRouter(prefix="/profile", tags=["User Profile"])

# Helper: Mock upload (Replace with S3/Cloudinary in production)
def save_upload_file(upload_file: UploadFile) -> str:
    # For demo, just return a fake URL or local path logic
    # In real app: file.location (S3)
    return f"http://localhost:8000/static/uploads/{upload_file.filename}"

@router.get("", response_model=UserProfileRead)
def get_my_profile(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    profile = get_profile_by_user_id(db, current_user.id)
    
    if not profile:
        # Return a default structure if profile doesn't exist yet
        return UserProfileRead(
            id=0, 
            user_id=current_user.id, 
            email=current_user.email
        )
    
    # Attach email from user table to response
    profile_data = profile.dict()
    profile_data["email"] = current_user.email
    return UserProfileRead(**profile_data)

@router.put("", response_model=UserProfileRead)
def update_my_profile(
    profile_update: UserProfileUpdate,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    profile, error = create_or_update_profile(db, current_user.id, profile_update)
    
    if error:
        raise HTTPException(status_code=400, detail=error)
        
    profile_data = profile.dict()
    profile_data["email"] = current_user.email
    return UserProfileRead(**profile_data)

@router.post("/upload-photo")
async def upload_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Mock upload logic
    url = save_upload_file(file)
    
    # Update profile URL
    profile = get_profile_by_user_id(db, current_user.id)
    if profile:
        profile.profile_photo_url = url
    else:
        profile = UserProfile(user_id=current_user.id, profile_photo_url=url)
        db.add(profile)
    
    db.commit()
    return {"url": url}