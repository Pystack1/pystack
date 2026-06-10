# Pystack Backend

This backend is built with FastAPI and SQLModel.

## Quick start

1. Create a venv:
   ```bash
   python -m venv backend/venv
   ```
2. Activate it:
   - PowerShell:
     ```powershell
     .\backend\venv\Scripts\Activate.ps1
     ```
   - CMD:
     ```cmd
     .\backend\venv\Scripts\activate.bat
     ```
3. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Run the app:
   ```bash
   python backend/main.py
   ```

## API endpoints

- `POST /auth/login` → admin login
- `POST /auth/refresh` → refresh access token
- `GET /dashboard/` → admin dashboard summary
- `GET /courses/` → list courses
- `GET /courses/{id}` → course details
- `POST /courses/` → create course (admin only)
- `POST /enquiries/` → submit enquiry
- `GET /enquiries/` → list enquiries (admin only)

## Default admin user

- Email: `admin@pystack.local`
- Password: `AdminPass123!`

> Change `backend/security/jwt.py` SECRET_KEY before using in production.
