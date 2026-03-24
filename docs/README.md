# CyberShield Docs

This folder contains project planning, tracking, and implementation notes for CyberShield.

## Current Build Status

Implemented backend modules:

- Authentication API (register/login)
- Incident Reporting API (create/get/update status)
- AI detection integration route

Implemented AI module:

- FastAPI service with /api/predict
- MVP scam classifier (keyword-based)

## Active Services

Backend (Node + Express):

- Base URL: http://localhost:5000
- Health: GET /

AI Service (FastAPI):

- Base URL: http://localhost:8000
- Health: GET /
- Predict: POST /api/predict

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
