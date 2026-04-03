# CyberShield Onboarding Guide

This guide helps a new contributor run the full stack locally, including the AI service.

## 1) What runs in this project

CyberShield has 3 runtime apps:

1. Client (React + Vite) on port 3000
2. Server (Node + Express + MongoDB) on port 5000
3. AI Service (FastAPI) on port 8000

Important:
- The AI service does not start automatically.
- You must start all 3 apps in separate terminals.

## 2) Prerequisites

Install these first:

- Node.js 18+ (LTS recommended)
- npm
- Python 3.10+ (3.11 works too)
- MongoDB connection string (Atlas or local)

Optional but useful:

- Git
- VS Code

## 3) Project setup

From the repository root:

1. Install server dependencies
```powershell
cd server
npm install
```

2. Install client dependencies
```powershell
cd ../client
npm install
```

3. Prepare Python environment for AI service
```powershell
cd ../ai-service
python -m venv .venv
```

4. Activate the virtual environment
```powershell
.\.venv\Scripts\Activate.ps1
```

5. Install AI service packages
```powershell
pip install fastapi uvicorn pydantic
```

## 4) Server environment configuration

Create or update the server env file at server/.env with these keys:

- PORT=5000
- MONGO_URI=<your_mongodb_connection_string>
- JWT_SECRET=<your_secret>
- AI_SERVICE_URL=http://localhost:8000
- EMAIL_MOCK=true

Copy-paste template:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
AI_SERVICE_URL=http://localhost:8000
EMAIL_MOCK=true
```

Email notes:

- Use EMAIL_MOCK=true for local development to avoid SMTP setup.
- If you want real OTP emails, configure EMAIL_USER and EMAIL_PASS too.

## 5) Start the full stack

Open 3 terminals and run:

Terminal A (server):

```powershell
cd server
npm run dev
```

Terminal B (client):

```powershell
cd client
npm run dev
```

Terminal C (ai-service):

```powershell
cd ai-service
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 6) Verify everything is healthy

1. AI service health:
- Open http://localhost:8000/
- Expected: {"message":"AI Service Running"}

2. Server health:
- Open http://localhost:5000/
- Expected: API is running...

3. Client:
- Open http://localhost:3000

4. AI flow from app:
- Go to AI detector page and submit text
- If AI works, you get SAFE / SUSPICIOUS / MALICIOUS response

## 7) How AI integration works

- Client calls the Node server API.
- Server endpoint /api/ai/predict forwards text to AI service /api/predict.
- If AI service is down or AI_SERVICE_URL is wrong, server returns AI service failed.

## 8) Common startup issues and fixes

Issue: AI service failed in server logs
- Cause: AI service not running, wrong AI_SERVICE_URL, or wrong port.
- Fix: Start FastAPI service and verify http://localhost:8000/.

Issue: DB Error on server start
- Cause: invalid or missing MONGO_URI.
- Fix: update server/.env with a working MongoDB connection string.

Issue: OTP/email errors while testing auth
- Cause: SMTP not configured.
- Fix: set EMAIL_MOCK=true in server/.env for local onboarding.

Issue: Client cannot call backend
- Cause: server not running on port 5000.
- Fix: run npm run dev in server and confirm http://localhost:5000/.

## 9) First-day sanity checklist

- Server dependencies installed
- Client dependencies installed
- AI venv created and activated
- AI packages installed
- server/.env configured
- Server running on 5000
- Client running on 3000
- AI service running on 8000
- AI detector returns classification successfully

## 10) Recommended daily workflow

1. Start AI service first
2. Start server second
3. Start client last
4. Keep all 3 terminals active while developing

## 11) Quick copy-paste startup pack

Use this when your dependencies are already installed.

Terminal A (server):

```powershell
cd server
npm run dev
```

Terminal B (client):

```powershell
cd client
npm run dev
```

Terminal C (ai-service):

```powershell
cd ai-service
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 12) One-command startup (Windows)

From the repository root, run one of these:

```powershell
.\start-dev.ps1
```

or:

```cmd
start-dev.cmd
```

What it does:
- Opens 3 separate PowerShell windows
- Starts server (`npm run dev`)
- Starts client (`npm run dev`)
- Starts AI service (`uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`)

To stop all services, close each service window (or press Ctrl+C in each).
