from sqlmodel import Session, select
from backend.models.user import User
from backend.models.user_profile import UserProfile
from backend.schemas.user_profile import UserProfileCreate, UserProfileUpdate

def get_profile_by_user_id(db: Session, user_id: int):
    return db.exec(select(UserProfile).where(UserProfile.user_id == user_id)).first()

def create_or_update_profile(db: Session, user_id: int, profile_data: UserProfileUpdate):
    # 1. Handle Email Update in User Table
    user = db.get(User, user_id)
    if not user:
        return None, "User not found"

    if profile_data.email and profile_data.email != user.email:
        # Check if email already exists
        existing_user = db.exec(select(User).where(User.email == profile_data.email)).first()
        if existing_user:
            return None, "Email already registered with another account"
        user.email = profile_data.email
    
    # 2. Handle Profile Table
    profile = get_profile_by_user_id(db, user_id)
    
    if profile:
        # Update existing
        profile_data_dict = profile_data.dict(exclude_unset=True)
        # Remove email from profile dict as we handled it above
        profile_data_dict.pop("email", None)
        
        for key, value in profile_data_dict.items():
            setattr(profile, key, value)
        
        db.add(profile)
    else:
        # Create new
        profile_data_dict = profile_data.dict(exclude_unset=True)
        profile_data_dict.pop("email", None)
        new_profile = UserProfile(user_id=user_id, **profile_data_dict)
        db.add(new_profile)
        profile = new_profile

    db.commit()
    db.refresh(profile)
    # Refresh user to get updated email
    db.refresh(user)
    
    return profile, None