# CyberShield

CyberShield is a full-stack cybersecurity platform for reporting threats, triaging suspicious messages with AI, moderating community content, and managing users through role-based admin tools.

## Live Deployments

- Frontend: [https://cyber-shield-eight.vercel.app](https://cyber-shield-eight.vercel.app)
- Frontend preview: [https://cyber-shield-nzeoni1oj-mystifys-projects.vercel.app](https://cyber-shield-nzeoni1oj-mystifys-projects.vercel.app)
- Backend API: [https://cybershield-backend-inx9.onrender.com](https://cybershield-backend-inx9.onrender.com)
- AI service: [https://cybershield-ai-sm3o.onrender.com](https://cybershield-ai-sm3o.onrender.com)

## What It Does

- Public threat reporting and safe public feeds
- OTP-based authentication and password recovery
- Role-based user governance: USER, ADMIN, SUPER_ADMIN
- AI-based scam detection with backend proxying to a FastAPI service
- Community forum with authenticated posting and replies
- Knowledge Hub with moderation workflow
- Video Hub and Meme Hub with admin moderation
- XP, streak, badges, and coin economy systems
- Error observability with client-side error capture and admin logs

## Current Status

The project is in release-ready state:

- Core product modules are implemented
- Security hardening is in place
- Forum pagination is implemented
- Role-specific user data endpoints are implemented
- Protected route token validation is implemented
- Production builds succeed
- Live backend, AI service, and frontend deployments are available

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose
- AI service: FastAPI
- Auth: JWT + OTP email verification
- File upload: Multer
- UI feedback: react-hot-toast

## Repository Layout

- `client/` - React frontend
- `server/` - Express backend
- `ai-service/` - FastAPI AI service
- `docs/` - project docs, logs, TODOs, onboarding, and variables
- `scripts/` - startup helpers

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB connection string

### Start everything

From the repository root:

```powershell
npm run dev
```

That launches the backend, frontend, and AI service through the root startup script.

### Run individual services

Backend:

```powershell
cd server
npm install
npm run dev
```

Frontend:

```powershell
cd client
npm install
npm run dev
```

AI service:

```powershell
cd ai-service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Environment Variables

### Server

Use `server/.env` or deploy-time environment variables.

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=strong_secret
JWT_EXPIRES_IN=24h
AI_SERVICE_URL=https://your-ai-service-url
ALLOWED_ORIGINS=https://your-frontend-url
ENCRYPTION_KEY=32+_char_strong_key
EMAIL_USER=your_email
EMAIL_PASS=app_password
EMAIL_MOCK=true
```

### Client

```env
VITE_API_URL=https://your-backend-url
```

### AI Service

```env
PORT=8000
```

## Production Notes

- Backend uses `AI_SERVICE_URL` to call the AI prediction endpoint.
- Frontend uses `VITE_API_URL` to call the deployed backend.
- The backend expects production origins to be listed in `ALLOWED_ORIGINS`.
- The backend exposes a health endpoint at `GET /api/health`.

## Key API Routes

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-otp`
- `POST /api/auth/resend-otp`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/validate`

### Reports

- `GET /api/reports`
- `GET /api/reports/user`
- `GET /api/reports/me`
- `POST /api/reports`
- `PUT /api/reports/:id`

### AI

- `POST /api/ai/predict`

### Forum

- `GET /api/forum`
- `GET /api/forum/user`
- `POST /api/forum`
- `POST /api/forum/:id/reply`

### Articles

- `GET /api/articles`
- `GET /api/articles/user`
- `GET /api/articles/admin/pending`
- `POST /api/articles`
- `PUT /api/articles/:id/status`

### Admin / Observability

- `GET /api/admin/stats`
- `GET /api/admin/users`
- `GET /api/admin/reports`
- `GET /api/system/client-errors`
- `GET /api/system/client-errors/export`

## Build And Verification

Frontend production build:

```bash
npm --prefix client run build
```

Backend smoke check:

```bash
npm --prefix server run dev
```

## Documentation

- [docs/README.md](docs/README.md)
- [docs/onboarding.md](docs/onboarding.md)
- [docs/context.md](docs/context.md)
- [docs/todo.md](docs/todo.md)
- [docs/variables.md](docs/variables.md)
- [docs/logs.md](docs/logs.md)
- [docs/bugs.md](docs/bugs.md)

## Resume Summary

Built and deployed a full-stack cybersecurity platform with AI-based phishing detection, role-based access control, and real-time reporting features.
