from pydantic import BaseModel


class DashboardRead(BaseModel):
    total_courses: int
    total_enquiries: int
    total_users: int
    total_admins: int
