from typing import Optional, List, Tuple
from sqlmodel import Session, select, delete
from sqlalchemy.orm import joinedload   # ← FIXED IMPORT

from backend.models.user import User, Role, UserRole
from backend.security.jwt import get_password_hash, verify_password, create_access_token, create_refresh_token

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.exec(select(User).where(User.email == email)).first()

def authenticate_user(db: Session, email: str, password: str) -> Tuple[Optional[User], Optional[str]]:
    user = get_user_by_email(db, email)
    
    if not user or not verify_password(password, user.hashed_password):
        return None, "Invalid email or password."
    
    if not user.is_active:
        return None, "Account pending approval. Please contact Admin."
    
    return user, None

def create_user(db: Session, email: str, password: str, full_name: Optional[str] = None, role_name: str = "User") -> User:
    hashed_password = get_password_hash(password)
    
    user = User(
        email=email,
        full_name=full_name,
        hashed_password=hashed_password,
        is_active=False
    )
    
    db.add(user)
    db.flush()

    role = db.exec(select(Role).where(Role.name == role_name)).first()
    if not role:
        role = Role(name=role_name)
        db.add(role)
        db.flush()

    if role:
        user_role_link = UserRole(user_id=user.id, role_id=role.id)
        db.add(user_role_link)

    db.commit()
    db.refresh(user)
    return user

# ==================== FIXED ====================
def update_user_status(db: Session, user_id: int, is_active: bool, role_names: List[str]) -> Optional[User]:
    user = db.get(User, user_id)
    if not user:
        return None

    user.is_active = is_active

    # Properly delete old roles
    db.exec(delete(UserRole).where(UserRole.user_id == user_id))

    # Add new roles
    for role_name in role_names:
        role = db.exec(select(Role).where(Role.name == role_name)).first()
        if role:
            db.add(UserRole(user_id=user.id, role_id=role.id))

    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# ==================== FIXED ====================
def get_all_users(db: Session) -> List[User]:
    return db.exec(
        select(User)
        .options(joinedload(User.roles))
        .order_by(User.created_at.desc())
    ).unique().all()   # ← Add .unique()

def delete_user(db: Session, user_id: int) -> bool:
    user = db.get(User, user_id)
    if not user:
        return False
    
    # Prevent deleting SuperAdmin or yourself (extra safety)
    if any(role.name == "SuperAdmin" for role in user.roles):
        return False
    
    db.delete(user)
    db.commit()
    return True

def create_tokens_for_user(user: User, db: Session) -> dict:
    access_token = create_access_token(subject=user.email)
    refresh_token = create_refresh_token(subject=user.email)
    
    user.refresh_token = refresh_token
    db.add(user)
    db.commit()
    
    return {"access_token": access_token, "refresh_token": refresh_token}