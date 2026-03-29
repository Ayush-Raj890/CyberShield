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

### Reports

- POST /api/reports (protected, multipart/form-data)
- GET /api/reports (public)
- PUT /api/reports/:id (admin)

### AI

- POST /api/ai/predict (public)

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

Protected:

- /dashboard
- /profile
- /create-report
- /forum/create

Admin Protected:

- /admin
- /admin/reports
- /admin/users
- /admin/articles
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

Report:

- severity, contactEmail, evidence
- isAnonymous, isSensitive
- history[] timeline

Article:

- status: PENDING, APPROVED, REJECTED

ClientErrorLog:

- message, stack, source, path, method, statusCode
- createdAt for filtering/export
