import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parent.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles # <--- ADD THIS IMPORT

# Import Routers ONLY
from backend.routers import auth, courses, enquiries, dashboard, review ,user_profile

app = FastAPI(title="Pystack Backend")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup (Simple version)
from backend.database import create_db_and_tables

@app.on_event("startup")
def startup_event():
    create_db_and_tables()

# Include Routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(courses.router, prefix="/courses", tags=["courses"])
app.include_router(enquiries.router, prefix="/enquiries", tags=["enquiries"])
app.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
app.include_router(review.router, prefix="/reviews", tags=["reviews"])

# user
app.include_router(user_profile.router, prefix="/user", tags=["profile"])

# --- ADD THIS LINE AT THE BOTTOM ---
# This tells FastAPI: "If someone asks for /static/..., look in the 'backend/static' folder"
app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)