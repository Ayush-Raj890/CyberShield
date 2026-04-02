# CyberShield Docs

This folder contains project planning, tracking, and implementation notes for CyberShield.

Quick links:

- [Onboarding Guide](onboarding.md)

Startup shortcuts:

- `start-all.ps1` on Windows PowerShell
- `npm run dev` from the repository root
- `start-all.cmd` on Windows
- `bash start-all.sh` on macOS/Linux

## Current Build Status

Implemented backend modules:

- Authentication API (register/login + email OTP verification + resend OTP)
- Forgot password + reset password via email token flow
- User Profile API (profile read/update + password change + ownership stats)
- Gamification engine (XP, levels, streaks, badges, event-based rewards)
- Virtual economy engine (coin earn/spend rules for engagement and anti-spam)
- Incident Reporting API (create/get/update status + evidence upload)
- AI detection integration route (public prediction endpoint)
- Knowledge Hub API (user submission + approval-based publishing)
- Community Forum API (public read, authenticated post/reply)
- Video Hub API (submit, public approved feed, admin moderation)
- Meme Hub API (upload, feed, voting, auto-flagging, admin moderation)
- Game API (phishing reward endpoint with auth + anti-abuse cooldown)
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
- Dashboard wallet snapshot (daily earn progress, remaining budget, UTC reset hint)
- Report pages (Create Report, View Reports)
- Enhanced reports with file upload (evidence), severity levels, and contact email
- Report detail view with evidence image/document viewing
- AI Detector page (`/ai`)
- Knowledge Hub pages (Articles list + Article detail + user submission form)
- User-submitted article submission with approval workflow
- Community Forum pages (`/forum`, `/forum/create`)
- Video Hub pages (`/videos`, `/videos/submit`)
- Meme Hub pages (`/memes`, `/memes/upload`)
- Phishing Detector game page (`/games`) with reusable question card module
- Contextual quick-create CTAs on Reports, Video Hub, and Meme Hub pages
- Admin pages (Dashboard, Manage Reports, Manage Users, Manage Articles)
- Admin page (Video Moderation)
- Admin page (Meme Moderation)
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

## Meme + Fun Hub

Gamified learning module designed to increase engagement and cybersecurity awareness:

- **Meme Hub (Implemented):**
  - User image upload with caption/category
  - Public visible feed
  - Community upvote/downvote system
  - Auto-flagging threshold for community-driven moderation
  - Admin flagged queue with approve/remove actions and voting toggle
  - Vote throttling guard (rate limiter)
  - Engagement loop rewards (meme create, meme liked, meme voted participation)
  - Anti-abuse checks (self-vote blocked, duplicate same-vote no XP)
- **Mini Games:** Phishing Detector (implemented), URL Checker (planned), Password Strength (planned)
- **Gamification Integration:** Meme upload, meme like, and meme voting XP actions added; meme-focused badges added
- **Economy Integration (Implemented):** Coin rewards (daily login/report/meme/likes) and action costs (meme upload/downvote/forum post/comment)
- **Economy Visibility (Implemented):** Dashboard now surfaces daily cap progress, remaining earn budget, and UTC reset countdown

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
- Meme submission and moderation flow (with vote-driven auto-flagging) - foundational implementation completed
- Mini security games (phishing detector, URL checker, password strength) - planning phase completed, awaiting implementation decisions
- Smart insights and challenge loops (awareness score, weekly goals)
- Coin economy UI expansion (dedicated wallet history and analytics) - pending polish

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
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- POST /api/auth/forgot-password
- POST /api/auth/reset-password

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

Memes:

- GET /api/memes (public visible feed)
- POST /api/memes (protected, image upload)
- POST /api/memes/:id/vote (protected, up/down voting)
- GET /api/memes/admin/flagged (admin)
- PUT /api/memes/:id (admin moderation)

Games:

- POST /api/game/reward (protected, correct-answer reward)

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

- `npm run make:super-admin -- your-email@example.com`
- `npm run reset:password -- your-email@example.com NewPassword123`

## Frontend Route Summary

- / (Public Home)
- /login
- /register
- /verify
- /forgot-password
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
- /memes (public)
- /memes/upload (protected)
- /games (protected)
- /admin (protected, admin only)
- /admin/reports (protected, admin only)
- /admin/users (protected, admin only)
- /admin/articles (protected, admin only)
- /admin/videos (protected, admin only)
- /admin/memes (protected, admin only)
- /admin/notifications (protected, admin only)
- /admin/error-logs (protected, admin only)
- /500
- \* (404 fallback)

## Environment

Backend .env expected keys:

- PORT=5000
- MONGO_URI=your_mongodb_uri
- JWT_SECRET=supersecretkey
- AI_SERVICE_URL=`http://localhost:8000`
- ALLOWED_ORIGINS=`http://localhost:3000,http://localhost:5173`
- DEBUG_REQUEST_LOGS=false
- ENCRYPTION_KEY=your_64_char_hex_key
- EMAIL_USER=your_gmail_address
- EMAIL_PASS=your_gmail_app_password
- EMAIL_MOCK=false

## Tracking Files

- context.md: project scope and constraints
- todo.md: planned and completed tasks
- logs.md: implementation history
- variables.md: constants, routes, and enums
- bugs.md: known issues and fixes
