from fastapi import APIRouter, Depends
from sqlmodel import Session

from backend.database import get_db
from backend.schemas.dashboard import DashboardRead
from backend.security.jwt import get_current_admin_or_superadmin
from backend.services.dashboard_service import get_dashboard_summary

router = APIRouter( tags=["dashboard"])


@router.get("/", response_model=DashboardRead)
def get_dashboard(
    db: Session = Depends(get_db),
    user=Depends(get_current_admin_or_superadmin)
):
    summary = get_dashboard_summary(db)
    return DashboardRead(**summary)