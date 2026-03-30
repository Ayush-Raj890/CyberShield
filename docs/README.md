# CyberShield Docs

This folder contains project planning, tracking, and implementation notes for CyberShield.

## Current Build Status

Implemented backend modules:

- Authentication API (register/login + email OTP verification + resend OTP)
- User Profile API (profile read/update + password change + ownership stats)
- Gamification engine (XP, levels, streaks, badges, event-based rewards)
- Incident Reporting API (create/get/update status + evidence upload)
- AI detection integration route (public prediction endpoint)
- Knowledge Hub API (user submission + approval-based publishing)
- Community Forum API (public read, authenticated post/reply)
- Video Hub API (submit, public approved feed, admin moderation)
- Admin APIs (stats, users, reports, article deletion, promote/suspend/demote user roles)
- Notification API (list + mark read)
- System observability API (client error logs, filter, CSV export)

Implemented AI module:

- FastAPI service with /api/predict
- MVP scam classifier (keyword-based)
- Upgraded keyword scoring classifier with tiered outputs (SAFE / SUSPICIOUS / MALICIOUS)
- Confidence mapping: SAFE 0.8, SUSPICIOUS 0.6, MALICIOUS 0.9

Implemented frontend modules:

- Public Home page and public discovery flow
- Auth pages (Login/Register)
- User Profile page (`/profile`)
- Settings page (`/settings`) with profile/password/preferences/danger zone actions
- Alias-first identity display with username hover hint (forum, articles, admin, profile)
- User Dashboard (navigation hub)
- Unified modular dashboard engine (`user`/`admin`) with lazy analytics
- Dashboard gamification panels (XP, level, streak, badges)
- Report pages (Create Report, View Reports)
- Enhanced reports with file upload (evidence), severity levels, and contact email
- Report detail view with evidence image/document viewing
- AI Detector page (`/ai`)
- Knowledge Hub pages (Articles list + Article detail + user submission form)
- User-submitted article submission with approval workflow
- Community Forum pages (`/forum`, `/forum/create`)
- Video Hub pages (`/videos`, `/videos/submit`)
- Admin pages (Dashboard, Manage Reports, Manage Users, Manage Articles)
- Admin page (Video Moderation)
- Admin pages (Notifications, Error Logs)
- Hybrid routing model (public content + protected write/admin actions)
- Shared API service with auth interceptor
- Reusable Navbar layout component
- Domain-grouped Navbar UX (Core, Activity, Learn, Account, Admin)
- Reusable AdminNavbar layout component
- Mobile responsiveness pass across primary user flows (navbars, profile, reports, forum, articles, AI)
- Global UI design system (`.card`, `.btn`, `.btn-primary`, `.btn-danger`, `.input`)
- Polished status indicators for reports and AI prediction result cards
- Lucide icons integrated for premium navigation and dashboard hierarchy
- Toast notifications (`react-hot-toast`) replacing alert popups
- Loading states for submit/analyze/admin actions
- Frontend auth validation for login/register (email format + minimum password length)
- Backend auth validation for register/login (required fields + email format + minimum password length)
- Frontend input sanitization utility for XSS prevention (light layer)
- Backend global security middleware: helmet + custom XSS sanitizer + custom NoSQL sanitizer
- Backend request validation/sanitization using express-validator on key auth/report/system routes
- File upload system via multer for report evidence (images/PDFs)
- Enhanced Report model with severity, contactEmail, and evidence file path
- User-submitted articles with admin approval workflow
- Article model with status field (PENDING, APPROVED, REJECTED)
- Admin moderation interface for pending article review
- Public API only shows approved articles
- Admin endpoints for pending article management and status updates
- Admin user governance controls (Make Admin, Suspend, Remove Admin)
- Super Admin operational tooling via CLI script
- Global React error fallback pages (`/500`, wildcard 404)
- Client error reporting button from 500 page
- Light-only theme currently active (dark mode switch tracked in TODO)

## Architecture Locked (Next Phase)

Dashboard system has been locked as a modular, scalable design for upcoming implementation:

- Premium tab-based dashboards for both client and admin
- Hybrid metrics model (real API data + frontend-calculated insights)
- Dark mode ready strategy (state-ready, not forced globally)
- Charts loaded on-demand when analytics tab is active (lazy import)

Planned tab structure:

- Client: Overview | Analytics | Reports
- Admin: Overview | Analytics | Moderation

Planned build order:

1. Refactor reusable analytics dashboard component to dynamic props-driven model
2. Build ClientDashboard and AdminDashboard containers
3. Integrate API data sources and calculated metrics
4. Add async/lazy chart loading in analytics tabs

Implementation status:

- Core dashboard engine is implemented and routed for both user and admin
- Lazy analytics loading is implemented
- Chart visualization library integration remains pending

## Product Growth Roadmap (Planned)

Strategic shift:

- From functional utility app -> retention-first product
- Focus on motivation loops, habit loops, and repeat engagement

Four product pillars:

1. Protect (already established): reports, AI triage, privacy workflows
2. Learn (expansion planned): structured learning, short-form video hub, gamified learning
3. Community (expansion planned): forum discussions, meme sharing, engagement loops
4. Engagement (new pillar): XP/levels, streaks, badges, mini-games, smart insights

High-impact features queued:

- Gamification system (XP, levels, badges, streaks) - foundational implementation completed
- Short content hub (Video Hub + moderation workflow) - foundational implementation completed
- Meme submission and moderation flow
- Mini security games (phishing detector, URL checker, password strength)
- Smart insights and challenge loops (awareness score, weekly goals)

## Active Services

Backend (Node + Express):

- Base URL: `http://localhost:5000`
- Health: GET /

AI Service (FastAPI):

- Base URL: `http://localhost:8000`
- Health: GET /
- Predict: POST /api/predict

Frontend (Vite + React):

- Base URL: `http://localhost:3000` (or next available port)

## Backend API Summary

Auth:

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/verify-otp
- POST /api/auth/resend-otp

Users:

- GET /api/users/profile (protected, includes gamification + recent reports)
- PUT /api/users/profile (protected)
- PUT /api/users/change-password (protected)
- DELETE /api/users/me (protected)

Reports:

- POST /api/reports (protected, multipart/form-data)
- GET /api/reports (public)
- PUT /api/reports/:id

AI (backend proxy):

- POST /api/ai/predict (public, optional auth for XP tracking)

Knowledge Hub:

- GET /api/articles (public, approved only)
- GET /api/articles/:id (public, approved only)
- POST /api/articles (protected, user submission)
- GET /api/articles/admin/pending (admin)
- PUT /api/articles/:id/status (admin)

Forum:

- GET /api/forum (public)
- POST /api/forum (auth)
- POST /api/forum/:id/reply (auth)

Videos:

- GET /api/videos (public, approved only)
- POST /api/videos (protected, submission)
- GET /api/videos/pending (admin)
- PUT /api/videos/:id (admin status update)

Admin:

- GET /api/admin/stats
- GET /api/admin/users
- DELETE /api/admin/users/:id
- PUT /api/admin/promote/:id
- PUT /api/admin/suspend/:id
- PUT /api/admin/demote/:id (super admin only)
- GET /api/admin/reports
- DELETE /api/admin/articles/:id

Notifications:

- GET /api/notifications
- PUT /api/notifications/:id/read

System:

- POST /api/system/client-errors (public for client error reporting)
- GET /api/system/client-errors (admin)
- GET /api/system/client-errors/export (admin, CSV)

Tooling:

- npm run make:super-admin -- your-email@example.com

## Frontend Route Summary

- / (Public Home)
- /login
- /register
- /verify
- /dashboard (protected)
- /profile (protected)
- /settings (protected)
- /create-report (protected)
- /reports (public)
- /ai (public)
- /articles (public)
- /articles/:id (public)
- /forum (public)
- /forum/create (protected)
- /videos (public)
- /videos/submit (protected)
- /admin (protected, admin only)
- /admin/reports (protected, admin only)
- /admin/users (protected, admin only)
- /admin/articles (protected, admin only)
- /admin/videos (protected, admin only)
- /admin/notifications (protected, admin only)
- /admin/error-logs (protected, admin only)
- /500
- * (404 fallback)

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
