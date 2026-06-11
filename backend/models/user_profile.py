from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

class UserProfile(SQLModel, table=True):
    __tablename__ = "user_profiles"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", unique=True, index=True)
    
    # Personal Details
    full_name: Optional[str] = Field(default=None, max_length=100)
    mobile_number: Optional[str] = Field(default=None, max_length=15)
    date_of_birth: Optional[str] = Field(default=None) # Stored as YYYY-MM-DD string
    gender: Optional[str] = Field(default=None, max_length=10) # Male, Female, Other
    address: Optional[str] = Field(default=None)
    city: Optional[str] = Field(default=None)
    state: Optional[str] = Field(default=None)
    country: Optional[str] = Field(default=None)
    aadhar_number: Optional[str] = Field(default=None, max_length=12)
    pan_number: Optional[str] = Field(default=None, max_length=10)
    profile_photo_url: Optional[str] = Field(default=None)

    # Relationship to User
    user: "User" = Relationship(back_populates="profile")