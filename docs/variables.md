# Variables & Constants

## Backend Environment Variables

- PORT=5000
- MONGO_URI=your_mongodb_uri
- JWT_SECRET=supersecretkey
- AI_SERVICE_URL=http://localhost:8000
- ENCRYPTION_KEY=your_64_char_hex_key
- EMAIL_USER=your_gmail_address
- EMAIL_PASS=your_gmail_app_password
- EMAIL_MOCK=false

---

## Backend API Routes

### Auth

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/verify-otp
- POST /api/auth/resend-otp

### Users

- GET /api/users/profile (protected)
- PUT /api/users/profile (protected)
- PUT /api/users/change-password (protected)
- DELETE /api/users/me (protected)

### Reports

- POST /api/reports (protected, multipart/form-data)
- GET /api/reports (public)
- PUT /api/reports/:id (admin)

### AI

- POST /api/ai/predict (public, optional auth for XP rewards)

### Articles

- POST /api/articles (protected)
- GET /api/articles (public, approved only)
- GET /api/articles/:id (public, approved only)
- GET /api/articles/admin/pending (admin)
- PUT /api/articles/:id/status (admin)

### Forum

- GET /api/forum (public)
- POST /api/forum (protected)
- POST /api/forum/:id/reply (protected)

### Videos

- GET /api/videos (public, approved only)
- POST /api/videos (protected)
- GET /api/videos/pending (admin)
- PUT /api/videos/:id (admin)

### Notifications

- GET /api/notifications (admin)
- PUT /api/notifications/:id/read (admin)

### Admin

- GET /api/admin/stats
- GET /api/admin/users
- DELETE /api/admin/users/:id
- PUT /api/admin/promote/:id
- PUT /api/admin/suspend/:id
- PUT /api/admin/demote/:id (super admin only)
- GET /api/admin/reports
- DELETE /api/admin/articles/:id

### System (Error Observability)

- POST /api/system/client-errors
- GET /api/system/client-errors (admin)
- GET /api/system/client-errors/export (admin CSV)

---

## Frontend Routes

Public:

- /
- /login
- /register
- /verify
- /reports
- /ai
- /articles
- /articles/:id
- /forum
- /videos

Protected:

- /dashboard
- /profile
- /settings
- /create-report
- /forum/create
- /videos/submit

Admin Protected:

- /admin
- /admin/reports
- /admin/users
- /admin/articles
- /admin/videos
- /admin/notifications
- /admin/error-logs

Error pages:

- /500
- * (404)

---

## Roles

- USER
- ADMIN
- SUPER_ADMIN

---

## Report Status

- PENDING
- REVIEWED
- RESOLVED

---

## AI Output Labels

- SAFE
- SUSPICIOUS
- MALICIOUS

---

## OTP Auth Lifecycle

- Register creates 6-digit OTP with 10-minute expiry
- Unverified duplicate email is overwritten on re-register
- Verify endpoint blocks after 5 failed attempts
- Verify error payload includes attempts remaining
- Resend OTP resets attempt counter and expiry

---

## Security Middleware Stack

Global middleware (app.js):

- helmet()
- xssMiddleware() custom sanitizer
- sanitizeMiddleware() custom NoSQL operator key sanitizer
- express-rate-limit
- cors
- express.json
- morgan

Route-level validation:

- express-validator (auth, reports, system endpoint)

---

## Model Highlights

User:

- role, isSuspended
- isVerified
- verificationOTP
- otpExpires (TTL index)
- failedOtpAttempts
- alias (unique, sparse)
- bio
- xp
- level
- streak
- lastActive
- badges[] (`name`, `earnedAt`)

---

## Identity Display Rule

- Default label shows `name`
- If `alias` exists, UI shows `alias`
- When alias is shown, username is exposed on hover (`title` hint)

---

## UI Theme State

- Current theme: light-only
- Dark mode switch: not implemented yet (tracked in TODO)

---

## Mobile Responsiveness Status

- Core user flows have responsive spacing/wrapping updates (navbar, profile, reports, forum, knowledge pages, AI)
- Additional QA remains for remaining admin/auth edge cases

---

## Dashboard Architecture (Planned)

Reusable component target path:

- `client/src/components/ui/DashboardCore.jsx`
- `client/src/pages/dashboard/Dashboard.jsx`
- `client/src/components/dashboard/Charts.jsx`
- `client/src/services/dashboardService.js`

Tab mapping:

- Client dashboard tabs: `overview`, `analytics`, `reports`
- Admin dashboard tabs: `overview`, `analytics`, `moderation`

Metrics replacement strategy:

- Replace generic SaaS placeholders (revenue/sessions/conversion) with CyberShield domain metrics
- Client overview metrics: reports, articles, forum posts, AI checks
- Admin overview metrics: users, reports, pending reports, active users

---

## Dashboard Data Contract (Current)

Client data sources:

- GET `/api/users/profile`
- GET `/api/reports` (current implementation + frontend ownership filter)
- GET `/api/articles` (current implementation + frontend ownership filter)
- GET `/api/forum` (current implementation + frontend ownership filter)

Admin data sources:

- GET `/api/admin/stats`
- GET `/api/reports`
- GET `/api/articles/admin/pending`

Calculated metrics pattern:

- Compute status and trend metrics in frontend from fetched collections (for example pending/resolved counts)

Chart loading strategy:

- Lazy-load analytics chart modules only when `activeTab === "analytics"`

State management strategy:

- Local component state with `useState` + `useEffect`
- Props-driven dashboard component input (`<Dashboard data={dashboardData} />`)

Profile payload highlights (current):

- `user`: name, alias, email, bio, xp, level, streak, badges
- `stats`: reports, articles, posts
- `recentReports`: latest user reports for dashboard feed

---

## Engagement Expansion (Current + Planned)

Core pillars:

- Protect
- Learn
- Community
- Engagement

Gamification XP actions (implemented):

- Report submitted: `+20 XP`
- Article posted: `+30 XP`
- AI check used: `+5 XP`
- Daily login: `+2 XP`

Current badges:

- `Rookie`
- `Cyber Warrior`
- `Elite Defender`

Planned engagement metrics:

- `xp`
- `level`
- `currentStreak`
- `longestStreak`
- `awarenessScore`

---

## Content Modules

Video hub object shape:

- `title`
- `url` (embed-ready link)
- `category` (`AWARENESS`, `SCAM`, `TIPS`)
- `status` (`PENDING`, `APPROVED`, `REJECTED`)

Meme module shape:

- `title`
- `imageUrl` or `embedUrl`
- `category` (`SCAM_MEME`, `AWARENESS_MEME`)
- `status` (`PENDING`, `APPROVED`, `REJECTED`)

Mini-games (planned):

- `Phishing Detector`
- `URL Checker`
- `Password Strength Challenge`

---

## Planned API Contracts (Roadmap)

Gamification:

- GET `/api/users/engagement`
- POST `/api/users/engagement/award`

Short content:

- GET `/api/shorts` (public approved)
- POST `/api/shorts` (admin create)

Memes:

- GET `/api/memes` (public approved)
- POST `/api/memes` (auth submit)
- GET `/api/memes/admin/pending` (admin)
- PUT `/api/memes/:id/status` (admin)

Challenges and insights:

- GET `/api/challenges/weekly`
- GET `/api/users/insights`

Report:

- severity, contactEmail, evidence
- isAnonymous, isSensitive
- history[] timeline

Article:

- status: PENDING, APPROVED, REJECTED

ClientErrorLog:

- message, stack, source, path, method, statusCode
- createdAt for filtering/export
