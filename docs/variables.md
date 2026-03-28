# Variables & Constants

## Backend

### Environment Variables

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=supersecretkey
AI_SERVICE_URL=http://localhost:8000
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
EMAIL_MOCK=false

---

## API Routes

### Auth

POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-otp
POST /api/auth/resend-otp

### Reports

POST /api/reports (protected, multipart/form-data)
GET /api/reports (public)
PUT /api/reports/:id

### AI

POST /api/ai/predict

### Articles

POST /api/articles (user-submitted, status PENDING)
GET /api/articles (public, status APPROVED only)
GET /api/articles/:id (public, status APPROVED only)
GET /api/articles/admin/pending (admin only, status PENDING)
PUT /api/articles/:id/status (admin only, update status)

### Admin

GET /api/admin/stats
GET /api/admin/users
DELETE /api/admin/users/:id
PUT /api/admin/promote/:id
PUT /api/admin/suspend/:id
PUT /api/admin/demote/:id (super admin only)
GET /api/admin/reports
DELETE /api/admin/articles/:id

---

## Frontend Routes

/
/login
/register
/verify
/dashboard
/create-report
/reports
/ai
/articles
/articles/:id
/admin
/admin/reports
/admin/users
/admin/articles

---

## Frontend UI Libraries

lucide-react
react-hot-toast

---

## Roles

USER
ADMIN
SUPER_ADMIN

---

## Report Status

PENDING
REVIEWED
RESOLVED

---

## AI Output Labels

SAFE
SUSPICIOUS
MALICIOUS

---

## AI Predictor Rules (Current)

SCAM_KEYWORDS includes:
win, lottery, prize, claim, urgent, click, verify, otp, bank, free, offer, link, account, suspended

Classification thresholds:
- score >= 3 => MALICIOUS (confidence 0.9)
- score == 2 => SUSPICIOUS (confidence 0.6)
- score <= 1 => SAFE (confidence 0.8)

---

## Auth Validation Rules (Current)

Frontend (Login/Register):
- email must match basic email regex
- password length must be at least 6

Backend (register/login endpoints):
- required fields must be present
- email must match basic email regex
- password length must be at least 6 (register)
- suspended users are blocked from login and protected access
- users must verify email by OTP before login
- max 5 OTP verification attempts before resend is required
- resend OTP resets OTP expiry window and attempt counter

---

## Backend Security Middleware (Current)

Global middleware stack (app.js):
- helmet(): Secure HTTP headers (disable XSS reflection, content sniffing, etc.)
- xssMiddleware(): Escape harmful HTML characters in body/query/params
- sanitizeMiddleware(): Strip dangerous Mongo operator keys (`$` and `.`) from body/query/params
- cors(): Cross-origin resource sharing
- express.json(): Parse JSON bodies

Route-level middleware (auth/report endpoints):
- body().trim().escape(): Remove leading/trailing spaces, escape HTML
- body().isEmail().normalizeEmail(): Validate email format and normalize
- body().isLength({ min: 6 }): Enforce minimum length
- body().isIn([...]): Whitelist valid category values
- validationResult(): Check for validation errors before processing

---

## Frontend Security Utilities (Current)

sanitizer.js functions:
- cleanInput(text): Remove HTML tags and script injection attempts
- sanitizeObject(obj): Clean all string values in an object before API send

Usage in forms:
- Login/Register/CreateReport pages sanitize form data before API.post()

---

## Access Model (Current)

Public frontend pages:
- /
- /login
- /register
- /reports
- /ai
- /articles
- /articles/:id

Protected frontend pages:
- /dashboard
- /create-report
- /admin/*

Public backend read endpoints:
- GET /api/reports
- POST /api/ai/predict
- GET /api/articles
- GET /api/articles/:id

Protected backend write/moderation endpoints:
- POST /api/reports
- PUT /api/reports/:id
- POST /api/articles
- GET /api/articles/admin/pending
- PUT /api/articles/:id/status
- /api/admin/*

---

## Report Model Fields (Current)

- title (string, required)
- description (string, required)
- category (enum: PHISHING, SCAM, HARASSMENT, OTHER)
- severity (enum: LOW, MEDIUM, HIGH, default: LOW)
- contactEmail (string, optional)
- evidence (string, optional, file path from upload)
- status (enum: PENDING, REVIEWED, RESOLVED, default: PENDING)
- user (ref to User)
- timestamps (createdAt, updatedAt)

---

## Article Model Fields (Current)

- title (string, required)
- content (string, required)
- category (enum: PHISHING, SCAM, PRIVACY, GENERAL, default: GENERAL)
- createdBy (ref to User)
- status (enum: PENDING, APPROVED, REJECTED, default: PENDING)
- timestamps (createdAt, updatedAt)

---

## File Upload Configuration (Current)

Multer storage settings:
- destination: /uploads directory (relative to server root)
- filename: Date.now() + "-" + originalname
- file types allowed: JPEG, PNG, GIF, PDF
- static serving: /uploads endpoint serves files from uploads folder

---

## Article Workflow Status (Current)

User submits article:
- Created with status: PENDING
- Hidden from public API

Admin reviews:
- API: GET /api/articles/admin/pending (list all pending)
- API: PUT /api/articles/:id/status { status: "APPROVED" | "REJECTED" }
- UI: ManageArticles page with Pending & Published tabs

Public access:
- Only APPROVED articles returned from GET /api/articles
- Only APPROVED articles viewable from GET /api/articles/:id

---

## User Governance (Current)

Admin-level actions (ADMIN + SUPER_ADMIN):
- promote user: PUT /api/admin/promote/:id
- suspend user: PUT /api/admin/suspend/:id
- delete user: DELETE /api/admin/users/:id

Super Admin only action:
- demote admin: PUT /api/admin/demote/:id

CLI helper:
- npm run make:super-admin -- <email>

---

## User Model Fields (Auth Verification)

- isVerified (boolean, default: false)
- verificationOTP (string)
- otpExpires (date, 10-minute TTL index)
- failedOtpAttempts (number, default: 0)