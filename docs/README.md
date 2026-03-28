# CyberShield Docs

This folder contains project planning, tracking, and implementation notes for CyberShield.

## Current Build Status

Implemented backend modules:

- Authentication API (register/login + email OTP verification + resend OTP)
- Incident Reporting API (create/get/update status + evidence upload)
- AI detection integration route (public prediction endpoint)
- Knowledge Hub API (user submission + approval-based publishing)
- Admin APIs (stats, users, reports, article deletion, promote/suspend/demote user roles)

Implemented AI module:

- FastAPI service with /api/predict
- MVP scam classifier (keyword-based)
- Upgraded keyword scoring classifier with tiered outputs (SAFE / SUSPICIOUS / MALICIOUS)
- Confidence mapping: SAFE 0.8, SUSPICIOUS 0.6, MALICIOUS 0.9

Implemented frontend modules:

- Public Home page and public discovery flow
- Auth pages (Login/Register)
- User Dashboard (navigation hub)
- Report pages (Create Report, View Reports)
- Enhanced reports with file upload (evidence), severity levels, and contact email
- Report detail view with evidence image/document viewing
- AI Detector page (`/ai`)
- Knowledge Hub pages (Articles list + Article detail + user submission form)
- User-submitted article submission with approval workflow
- Admin pages (Dashboard, Manage Reports, Manage Users, Manage Articles)
- Hybrid routing model (public content + protected write/admin actions)
- Shared API service with auth interceptor
- Reusable Navbar layout component
- Reusable AdminNavbar layout component
- Global UI design system (`.card`, `.btn`, `.btn-primary`, `.btn-danger`, `.input`)
- Polished status indicators for reports and AI prediction result cards
- Lucide icons integrated for premium navigation and dashboard hierarchy
- Toast notifications (`react-hot-toast`) replacing alert popups
- Loading states for submit/analyze/admin actions
- Frontend auth validation for login/register (email format + minimum password length)
- Backend auth validation for register/login (required fields + email format + minimum password length)
- Frontend input sanitization utility for XSS prevention (light layer)
- Backend global security middleware: helmet (secure headers), xss-clean, express-mongo-sanitize
- Backend global security middleware: helmet + custom XSS sanitizer + custom NoSQL sanitizer
- Backend request validation/sanitization on auth and report endpoints using express-validator
- NoSQL injection prevention with express-mongo-sanitize middleware
- File upload system via multer for report evidence (images/PDFs)
- Enhanced Report model with severity, contactEmail, and evidence file path
- User-submitted articles with admin approval workflow
- Article model with status field (PENDING, APPROVED, REJECTED)
- Admin moderation interface for pending article review
- Public API only shows approved articles
- Admin endpoints for pending article management and status updates
- Admin user governance controls (Make Admin, Suspend, Remove Admin)
- Super Admin operational tooling via CLI script

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
- POST /api/auth/verify-otp
- POST /api/auth/resend-otp

Reports:

- POST /api/reports (protected, multipart/form-data)
- GET /api/reports (public)
- PUT /api/reports/:id

AI (backend proxy):

- POST /api/ai/predict

Knowledge Hub:

- GET /api/articles (public, approved only)
- GET /api/articles/:id (public, approved only)
- POST /api/articles (protected, user submission)
- GET /api/articles/admin/pending (admin)
- PUT /api/articles/:id/status (admin)

Admin:

- GET /api/admin/stats
- GET /api/admin/users
- DELETE /api/admin/users/:id
- PUT /api/admin/promote/:id
- PUT /api/admin/suspend/:id
- PUT /api/admin/demote/:id (super admin only)
- GET /api/admin/reports
- DELETE /api/admin/articles/:id

Tooling:

- npm run make:super-admin -- <email>

## Frontend Route Summary

- / (Public Home)
- /login
- /register
- /dashboard (protected)
- /create-report (protected)
- /reports (public)
- /ai (public)
- /articles (public)
- /articles/:id (public)
- /admin (protected, admin only)
- /admin/reports (protected, admin only)
- /admin/users (protected, admin only)
- /admin/articles (protected, admin only)

## Environment

Backend .env expected keys:

- PORT=5000
- MONGO_URI=your_mongodb_uri
- JWT_SECRET=supersecretkey
- AI_SERVICE_URL=http://localhost:8000
- EMAIL_USER=your_gmail_address
- EMAIL_PASS=your_gmail_app_password
- EMAIL_MOCK=false

## Tracking Files

- context.md: project scope and constraints
- todo.md: planned and completed tasks
- logs.md: implementation history
- variables.md: constants, routes, and enums
- bugs.md: known issues and fixes
