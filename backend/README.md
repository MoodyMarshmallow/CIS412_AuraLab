# AuraLab FastAPI service

Simple FastAPI + SQLModel backend matching the MVP spec. Uses SQLite for development so the API can boot without Postgres.

## Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
