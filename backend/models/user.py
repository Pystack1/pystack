from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship

from backend.models.user_profile import UserProfile

# ====================== ASSOCIATION TABLE ======================
class UserRole(SQLModel, table=True):
    __tablename__ = "user_roles"

    user_id: int = Field(foreign_key="users.id", primary_key=True)
    role_id: int = Field(foreign_key="roles.id", primary_key=True)


# ====================== ROLE MODEL ======================
class Role(SQLModel, table=True):
    __tablename__ = "roles"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(unique=True, index=True)   # SuperAdmin, Admin, User

    users: List["User"] = Relationship(
        back_populates="roles",
        link_model=UserRole
    )


# ====================== USER MODEL ======================
class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    full_name: Optional[str] = None
    hashed_password: str
    is_active: bool = Field(default=False)          # Approval flag
    refresh_token: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None, sa_column_kwargs={"onupdate": datetime.utcnow})

    roles: List[Role] = Relationship(
        back_populates="users",
        link_model=UserRole
    )
    profile: Optional["UserProfile"] = Relationship(
    back_populates="user"
)