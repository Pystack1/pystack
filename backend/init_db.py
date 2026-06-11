from sqlmodel import Session, select
from backend.database import create_db_and_tables, get_db
from backend.services.auth_service import get_user_by_email, create_user
from backend.models.user import User, Role

def init_superadmin():
    create_db_and_tables()
    
    db = next(get_db())
    
    superadmin_email = "superadmin@pystack.local"
    default_password = "SuperPass123!"
    
    # Check if SuperAdmin exists
    if not get_user_by_email(db, superadmin_email):
        print("🚀 Creating SuperAdmin user...")
        
        # Create the user (defaults to User role, we will fix that below)
        # Note: create_user sets is_active=False, so we must fix that too.
        superadmin = create_user(db, superadmin_email, default_password, "Super Admin")
        
        # 1. Make them active
        superadmin.is_active = True
        
        # 2. Assign SuperAdmin role
        super_role = db.exec(select(Role).where(Role.name == "SuperAdmin")).first()
        
        if not super_role:
            print("⚠️ SuperAdmin role not found. Creating it now...")
            super_role = Role(name="SuperAdmin")
            db.add(super_role)
            db.commit()
            db.refresh(super_role)

        # Clear default roles and assign SuperAdmin
        superadmin.roles.clear()
        superadmin.roles.append(super_role)
        
        db.add(superadmin)
        db.commit()
        db.refresh(superadmin)
            
        print(f"✅ SuperAdmin created: {superadmin_email}")
        print(f"   Password: {default_password}")
    else:
        print(f"ℹ️ SuperAdmin already exists: {superadmin_email}")
    
    db.close()

if __name__ == "__main__":
    init_superadmin()