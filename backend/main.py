import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from backend.database import create_db_and_tables, get_db
from backend.routers import auth, courses, enquiries, dashboard, review  # Fixed: reviews
from backend.services.auth_service import get_user_by_email, create_user
from backend.models.user import User, Role

app = FastAPI(title="Pystack Backend")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(courses.router, prefix="/courses", tags=["courses"])
app.include_router(enquiries.router, prefix="/enquiries", tags=["enquiries"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
app.include_router(review.router, prefix="/reviews", tags=["reviews"])   # Fixed name


@app.on_event("startup")
def startup_event():
    create_db_and_tables()
    
    # Create SuperAdmin if not exists
    db = next(get_db())   # Get session from generator
    
    superadmin_email = "superadmin@pystack.local"
    default_password = "SuperPass123!"
    
    if not get_user_by_email(db, superadmin_email):
        # Create user with default "User" role first
        superadmin = create_user(db, superadmin_email, default_password, "Super Admin")
        
        # Assign SuperAdmin role
        super_role = db.exec(select(Role).where(Role.name == "SuperAdmin")).first()
        if super_role:
            superadmin.roles.clear()
            superadmin.roles.append(super_role)
            superadmin.is_active = True  # SuperAdmin is auto-approved
            
            db.add(superadmin)
            db.commit()
            db.refresh(superadmin)
            
            print(f"✅ SuperAdmin created successfully: {superadmin_email}")
        else:
            print("⚠️ SuperAdmin role not found. Please insert roles first.")
    else:
        print(f"SuperAdmin already exists: {superadmin_email}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)