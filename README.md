# CyberShield

Project documentation has moved to [docs/README.md](docs/README.md).

Start here:

- [Onboarding Guide](docs/onboarding.md)
- [Project Context](docs/context.md)
- [TODO](docs/todo.md)
- [Variables](docs/variables.md)
- [Logs](docs/logs.md)
- [Bugs](docs/bugs.md)

## API Endpoints

Auth:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/verify-otp
- POST /api/auth/resend-otp
- POST /api/auth/forgot-password
- POST /api/auth/reset-password

Users:
- GET /api/users/profile
- PUT /api/users/profile
- PUT /api/users/change-password
- DELETE /api/users/me

Reports:
- GET /api/reports
- POST /api/reports
- PUT /api/reports/:id

Articles:
- GET /api/articles
- POST /api/articles

Videos:
- GET /api/videos
- POST /api/videos
- GET /api/videos/pending
- PUT /api/videos/:id

Memes:
- GET /api/memes
- POST /api/memes
- POST /api/memes/:id/vote
- GET /api/memes/admin/flagged
- PUT /api/memes/:id

Games:
- POST /api/game/reward

Admin:
- GET /api/admin/stats
- GET /api/admin/users
- PUT /api/admin/promote/:id

Notifications:
- GET /api/notifications
- PUT /api/notifications/:id/read

Pagination support:
- GET /api/reports?page=1&limit=10
- GET /api/admin/reports?page=1&limit=10

## Validation Rules (Current)

Frontend (Login/Register):

- Email must match a basic email format check
- Password must be at least 6 characters

Backend (Auth APIs):

- Required field validation on register/login
- Email format validation on register/login
- Password must be at least 6 characters on register
- Input sanitization and HTML escaping on all auth fields
- Email verification with 6-digit OTP before login
- Emails are normalized to lowercase without removing dots (e.g. `abc.def@gmail.com` remains unchanged)
- Re-register support for unverified accounts (old unverified record removed)
- OTP resend endpoint with cooldown support in UI
- OTP verification attempt limiting (max 5 attempts before forcing resend)
- Forgot password flow with email reset token (15-minute expiry)
- Report title, description, and category validation with sanitization
- Report severity and contactEmail optional validation
- Suspended users are blocked from login and protected API access

AI Predictor:

- Keyword scoring classifier with labels SAFE, SUSPICIOUS, MALICIOUS
- Thresholds: 0-1 matches = SAFE, 2 = SUSPICIOUS, 3+ = MALICIOUS

## Security Implementation (AppSec)

Backend:
- Global middleware: helmet (secure headers), custom XSS sanitizer middleware, custom NoSQL sanitizer middleware
- Route-level request validation/sanitization using express-validator on auth and report endpoints
- Input trimming, HTML escaping, email validation, and category whitelisting

Frontend:
- Utility sanitizer module for light-layer XSS prevention (HTML tag removal)
- Auth and report forms sanitize user input before API calls

## File Upload System

Backend:
- Multer storage configured for disk storage in /uploads directory
- File type filtering: JPEG, PNG, GIF, PDF
- Static file serving via Express on /uploads endpoint
- Report evidence stored as file path in database

Frontend:
- CreateReport form includes optional file input
- FormData used for multipart/form-data submissions
- Evidence preview in ViewReports (images inline, PDFs as links)

## User-Generated Content & Moderation

Backend:
- Articles can be submitted by any authenticated user
- User submissions created with status: PENDING
- Admin endpoints for viewing pending articles and approving/rejecting
- Public API only returns APPROVED articles

Frontend:
- Articles page includes submission form toggle
- Knowledge Hub shows only approved published articles
- Admin ManageArticles page with Pending vs Published tabs
- Approve/Reject buttons for pending content with creator contact info
- Video Hub page shows approved moderator-reviewed video content
- Video submit page allows authenticated users to submit videos for review
- Admin Video Moderation page approves/rejects pending videos
- Meme Hub page shows visible memes with community voting
- Upload Meme page allows authenticated users to submit image-based memes
- Admin Meme Moderation page manages flagged memes (approve/remove/toggle voting)
- Phishing Detector game page adds interactive SAFE/SCAM quiz flow with feedback, score, and rewards
- Identity labels use alias-first display; when alias exists, username is shown on hover
- Mobile responsiveness improvements applied across core user flows (navbars, profile, reports, forum, articles, AI)
- Dark mode switch is pending (tracked in docs/todo.md)
- Modular dashboard engine now powers both user and admin dashboards
- User dashboard now includes gamification progress (XP, level, streak, badges)
- Navbar reorganized into grouped product domains for cleaner navigation UX

Backend:

- Gamification model and reward engine implemented (XP, levels, streaks, badges)
- Event-based XP rewards wired to report/article/forum/AI/login actions
- Game reward endpoint wired to XP + coin rewards with cooldown protection
- Meme engagement loop rewards added (meme upload, meme liked, meme voted)
- Meme voting anti-abuse checks added (self-vote blocked, duplicate same-vote no XP, rate limiter)
- Virtual coin economy added (earn + spend rules with anti-spam action costs)
- Economy anti-farming controls added (daily earn cap, UTC daily reset, action cooldowns, diminishing rewards)

## Upcoming Dashboard Architecture (Locked)

- Modular tab-based dashboards
- Client tabs: Overview, Analytics, Reports
- Admin tabs: Overview, Analytics, Moderation
- Real + calculated metrics model
- Lazy-loaded charts (analytics tab only)
- Dark mode ready strategy (not globally forced yet)

## Upcoming Product Expansion (Planned)

- Retention-first strategy: engagement loops and motivation systems
- 4 product pillars: Protect, Learn, Community, Engagement
- Priority roadmap: gamification, short content hub, meme moderation, mini-games, smart insights

## Public Access Model

Public frontend routes:
- /
- /login
- /register
- /verify
- /reports
- /ai
- /articles
- /articles/:id
- /videos
- /memes
- /forum

Protected frontend routes:
- /dashboard
- /profile
- /settings
- /create-report
- /forum/create
- /videos/submit
- /memes/upload
- /games
- /admin/*

Public backend endpoints:
- GET /api/reports
- POST /api/ai/predict
- GET /api/articles
- GET /api/articles/:id
- GET /api/videos
- GET /api/memes

## Role Governance

Roles:
- USER
- ADMIN
- SUPER_ADMIN

Admin actions:
- Promote user to ADMIN
- Suspend user account
- Manage users/reports/articles

Super Admin action:
- Demote ADMIN to USER

Operational script:
- `npm run make:super-admin -- your-email@example.com`
