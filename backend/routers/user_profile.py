from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlmodel import Session
from typing import List, Optional

from backend.database import get_db
from backend.models.user import User
from backend.models.user_profile import UserProfile
from backend.schemas.user_profile import UserProfileRead, UserProfileUpdate
from backend.services.user_profile_service import get_profile_by_user_id, create_or_update_profile
from backend.security.jwt import get_current_user
import shutil
from pathlib import Path

router = APIRouter(prefix="/profile", tags=["User Profile"])

# Helper: Save upload file locally
def save_upload_file(upload_file: UploadFile) -> str:
    upload_dir = Path("static/uploads")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Clean filename to avoid path traversal
    safe_filename = Path(upload_file.filename).name
    file_path = upload_dir / safe_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    return f"http://localhost:8000/static/uploads/{safe_filename}"

@router.get("", response_model=UserProfileRead)
def get_my_profile(
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    profile = get_profile_by_user_id(db, current_user.id)
    
    if not profile:
        return UserProfileRead(
            id=0, 
            user_id=current_user.id, 
            email=current_user.email
        )
    
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
    # Save file
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