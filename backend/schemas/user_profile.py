from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime

class UserProfileBase(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None # Updating email here updates user table too
    mobile_number: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    aadhar_number: Optional[str] = None
    pan_number: Optional[str] = None
    profile_photo_url: Optional[str] = None

    # Validations
    @validator('email')
    def validate_email(cls, v):
        if v and '@' not in v:
            raise ValueError("Invalid email format")
        return v

    @validator('pan_number')
    def validate_pan(cls, v):
        if v:
            # Basic PAN format: 5 letters, 4 numbers, 1 letter (Example: ABCDE1234F)
            if len(v) != 10 or not v[:5].isalpha() or not v[5:9].isdigit() or not v[9].isalpha():
                raise ValueError("Invalid PAN format (e.g., ABCDE1234F)")
        return v

    @validator('aadhar_number')
    def validate_aadhar(cls, v):
        if v:
            if not v.isdigit() or len(v) != 12:
                raise ValueError("Aadhar must be 12 digits")
        return v

    @validator('date_of_birth')
    def validate_age(cls, v):
        if v:
            try:
                dob = datetime.strptime(v, "%Y-%m-%d")
                today = datetime.today()
                age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
                if age < 18:
                    raise ValueError("You must be at least 18 years old")
            except ValueError:
                raise ValueError("Invalid date format. Use YYYY-MM-DD")
        return v

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileUpdate(UserProfileBase):
    pass

class UserProfileRead(UserProfileBase):
    id: int
    user_id: int
    email: str # Read always includes email

    class Config:
        from_attributes = True