# Variables & Constants

## Backend

### Environment Variables

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=supersecretkey
AI_SERVICE_URL=http://localhost:8000

---

## API Routes

### Auth

POST /api/auth/register
POST /api/auth/login

### Reports

POST /api/reports
GET /api/reports
PUT /api/reports/:id

### AI

POST /api/ai/predict

### Articles

POST /api/articles
GET /api/articles
GET /api/articles/:id

### Admin

GET /api/admin/stats
GET /api/admin/users
DELETE /api/admin/users/:id
GET /api/admin/reports
DELETE /api/admin/articles/:id

---

## Frontend Routes

/
/register
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

## Roles

USER
ADMIN

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