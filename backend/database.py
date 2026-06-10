from sqlmodel import SQLModel, create_engine, Session
from backend.models.user import User, Role, UserRole   # Import all models
from backend.models.course import Course
from backend.models.enquiry import Enquiry
# Import other models here...

DATABASE_URL = "mysql+pymysql://root:Prasad123@localhost:3306/pystack_db"

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)

def get_db():
    with Session(engine) as session:
        yield session