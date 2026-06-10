from sqlmodel import Session, select, func
from sqlalchemy import or_
from typing import Dict

from backend.models.user import User, Role, UserRole
from backend.models.course import Course
from backend.models.enquiry import Enquiry


def get_dashboard_summary(db: Session) -> Dict:
    """Return dashboard statistics"""

    # Total Courses
    total_courses = db.exec(select(func.count()).select_from(Course)).one() or 0

    # Total Enquiries
    total_enquiries = db.exec(select(func.count()).select_from(Enquiry)).one() or 0

    # Total Active Users
    total_users = db.exec(
        select(func.count()).select_from(User).where(User.is_active == True)
    ).one() or 0

    # Total Admins (Admin + SuperAdmin)
    total_admins = 0

    admin_role = db.exec(select(Role).where(Role.name == "Admin")).first()
    superadmin_role = db.exec(select(Role).where(Role.name == "SuperAdmin")).first()

    if admin_role or superadmin_role:
        stmt = (
            select(func.count(func.distinct(User.id)))
            .select_from(User)
            .join(UserRole, User.id == UserRole.user_id)
        )

        conditions = []
        if admin_role:
            conditions.append(UserRole.role_id == admin_role.id)
        if superadmin_role:
            conditions.append(UserRole.role_id == superadmin_role.id)

        if conditions:
            stmt = stmt.where(or_(*conditions))
            total_admins = db.exec(stmt).one() or 0

    return {
        "total_courses": int(total_courses),
        "total_enquiries": int(total_enquiries),
        "total_users": int(total_users),
        "total_admins": int(total_admins),
    }