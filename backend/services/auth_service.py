from typing import Optional, List
from sqlmodel import Session, select

from backend.models.user import User, Role
from backend.security.jwt import get_password_hash, verify_password, create_access_token, create_refresh_token


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.exec(select(User).where(User.email == email)).first()


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    if not user.is_active:
        return None
    return user


def create_user(db: Session, email: str, password: str, full_name: Optional[str] = None) -> User:
    hashed_password = get_password_hash(password)
    user = User(
        email=email,
        full_name=full_name,
        hashed_password=hashed_password,
        is_active=False
    )
    
    # Assign default "User" role
    default_role = db.exec(select(Role).where(Role.name == "User")).first()
    if default_role:
        user.roles.append(default_role)   # Better to append

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def approve_user(db: Session, user_id: int, is_active: bool, role_names: List[str]):
    user = db.get(User, user_id)
    if not user:
        return None

    user.is_active = is_active
    user.roles.clear()

    for role_name in role_names:
        role = db.exec(select(Role).where(Role.name == role_name)).first()
        if role:
            user.roles.append(role)

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_all_pending_users(db: Session):
    return db.exec(select(User).where(User.is_active == False)).all()


def create_tokens_for_user(user: User) -> dict:
    access_token = create_access_token(user.email)
    refresh_token = create_refresh_token(user.email)
    
    user.refresh_token = refresh_token
    # Update refresh token
    db = Session.object_session(user) or Session(bind=engine)  # safer way
    db.merge(user)
    db.commit()
    
    return {"access_token": access_token, "refresh_token": refresh_token}