# AI Wedding Photo Finder System

A production-minded starter monorepo for an AI-powered wedding gallery search platform. The scaffold follows the HLD/LLD you shared and includes:

- A Django REST backend for admin authentication, event management, photo uploads, and guest selfie search
- A React + Tailwind frontend for the admin dashboard and guest portal
- Celery + Redis wiring for background face processing
- Local-media storage defaults with clear extension points for Cloudinary or S3

## Project Structure

```text
AI Wedding Photo Finder System/
├── backend/
│   ├── apps/
│   │   ├── events/
│   │   ├── face_engine/
│   │   ├── photos/
│   │   ├── search/
│   │   └── users/
│   ├── config/
│   ├── .env.example
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
└── docker-compose.yml
```

## Backend Highlights

- JWT-based admin authentication
- Event creation with generated event code and QR asset
- Bulk photo upload endpoint
- Celery task stub for extracting face embeddings
- Guest selfie search endpoint with Euclidean-distance matching

## Frontend Highlights

- Admin login, dashboard, event creation, upload, and analytics placeholders
- Guest event entry, QR scanner panel, selfie upload, and result gallery
- Shared API services ready to point at the Django backend

## Local Development

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Setup

- Copy `backend/.env.example` to `backend/.env`
- Copy `frontend/.env.example` to `frontend/.env`
- If you are not using Docker, change `POSTGRES_HOST` from `db` to `localhost`
- Leave the Postgres variables blank only if you want the backend to fall back to SQLite during local experiments
- Install `backend/requirements-ai.txt` only on machines where native `dlib` builds are supported

## Next Recommended Steps

1. Install dependencies and run migrations
2. Connect the photo pipeline to Cloudinary or S3
3. Replace JSON embeddings with `pgvector` or FAISS for faster production search
4. Add analytics endpoints for guest search trends
