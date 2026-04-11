# CyberShield System Design

## 1. Overview

CyberShield is a multi-service platform that combines threat reporting, scam triage via AI, and moderated community learning.

Services:

- Frontend: React + Vite
- Backend API: Node.js + Express
- AI service: FastAPI
- Database: MongoDB

## 2. Architecture

```text
Browser (React)
  -> Express API (/api/*)
      -> MongoDB (users, reports, community, moderation)
      -> FastAPI AI service (/api/predict)
```

Key design decision: AI inference is isolated in a separate service and consumed through backend proxy endpoints.

## 3. Backend Domain Modules

- Auth: register, verify OTP, login, forgot/reset password
- Users: profile, password changes, account lifecycle
- Reports: create/list/admin management with evidence upload
- AI: prediction proxy with guardrails and throttling
- Articles/Forum/Videos/Memes: public content + moderation workflow
- Admin: governance operations and system management
- System: health/version/uptime + client error observability

## 4. Security and Reliability Layers

- Helmet + CORS allowlist
- XSS and NoSQL sanitizer middleware
- Route-level request validation
- Endpoint-specific rate limits (auth and AI)
- Env-controlled debug logging
- Protected routes with JWT auth + role checks

## 5. Request Lifecycle (Example: AI Predict)

1. User submits text from UI.
2. Frontend calls `POST /api/ai/predict`.
3. Backend validates input and applies AI limiter.
4. Backend forwards request to FastAPI service.
5. Backend returns normalized response (label, confidence, reason).
6. UI renders result and optional report-handoff CTA.

## 6. Data Model Highlights

- User: auth, role, verification, suspension, XP/coins, streak, badges
- Report: incident metadata, severity, evidence, moderation status
- Article/Video/Meme/Forum: user-generated content + moderation fields
- Error Log: client/runtime error records with filters/export

## 7. Scaling Direction

Near-term:

- Add analytics counters and dashboard trend snapshots
- Add seed/demo mode for predictable showcase data

Long-term:

- Queue-based AI tasks for burst traffic
- Caching for public feeds and stats endpoints
- Search indexing for reports/articles/forum
- Audit trails and centralized logging sink
