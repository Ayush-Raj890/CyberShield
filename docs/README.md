# CyberShield Docs

This folder contains project planning, tracking, and implementation notes for CyberShield.

## Current Build Status

Implemented backend modules:

- Authentication API (register/login with role + token response)
- Incident Reporting API (create/get/update status)
- AI detection integration route
- Knowledge Hub API (create/get article, get article by id)
- Admin APIs (stats, users, reports, article deletion)

Implemented AI module:

- FastAPI service with /api/predict
- MVP scam classifier (keyword-based)

Implemented frontend modules:

- Auth pages (Login/Register)
- User Dashboard (navigation hub)
- Report pages (Create Report, View Reports)
- Protected routing with PrivateRoute
- Shared API service with auth interceptor
- Reusable Navbar layout component

## Active Services

Backend (Node + Express):

- Base URL: http://localhost:5000
- Health: GET /

AI Service (FastAPI):

- Base URL: http://localhost:8000
- Health: GET /
- Predict: POST /api/predict

Frontend (Vite + React):

- Base URL: http://localhost:3000 (or next available port)

## Backend API Summary

Auth:

- POST /api/auth/register
- POST /api/auth/login

Reports:

- POST /api/reports
- GET /api/reports
- PUT /api/reports/:id

AI (backend proxy):

- POST /api/ai/predict

Knowledge Hub:

- GET /api/articles
- GET /api/articles/:id
- POST /api/articles (ADMIN)

Admin:

- GET /api/admin/stats
- GET /api/admin/users
- DELETE /api/admin/users/:id
- GET /api/admin/reports
- DELETE /api/admin/articles/:id

## Environment

Backend .env expected keys:

- PORT=5000
- MONGO_URI=your_mongodb_uri
- JWT_SECRET=supersecretkey
- AI_SERVICE_URL=http://localhost:8000

## Tracking Files

- context.md: project scope and constraints
- todo.md: planned and completed tasks
- logs.md: implementation history
- variables.md: constants, routes, and enums
- bugs.md: known issues and fixes
