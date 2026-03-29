# Project Context

## Overview

CyberShield is a full-stack cybersecurity platform combining:

- Incident reporting
- AI-based threat triage
- Moderated knowledge sharing
- Community collaboration forum
- Admin governance and monitoring

## Current Scope

Implemented modules:

1. Authentication with OTP email verification
2. User Profile and personalization layer
3. Incident reporting with evidence upload
4. AI scam detector integration
5. Knowledge Hub with moderation workflow
6. Community Forum (public read, auth write)
7. Admin dashboard and role governance
8. Notification center
9. Client error logging and admin observability

Simplified items:

- Single AI model/classifier (keyword scoring)
- Monolith backend (no microservice split except AI service)
- No external queue system for background jobs

---

## Architecture

Frontend: React + Vite + Tailwind

Backend: Node.js + Express + Mongoose

Database: MongoDB Atlas

AI Service: FastAPI (`/api/predict`) called by backend proxy route

---

## User Roles

- USER
- ADMIN
- SUPER_ADMIN

---

## Access Model

Public:

- Home, login/register/verify
- Reports listing
- AI detector
- Knowledge Hub listing/detail
- Forum listing

Authenticated:

- Create report
- Create/reply forum posts
- Article submission
- Dashboard tools

Admin / Super Admin:

- User management
- Report moderation
- Article moderation
- Notification center
- Client error log dashboard/export

---

## Key Flows

1. OTP Auth Flow:
Register -> OTP email -> Verify OTP -> Login

2. Profile Flow:
Login -> View profile stats -> Update alias/bio -> Change password

3. Report Flow:
Create report -> Status lifecycle (`PENDING`/`REVIEWED`/`RESOLVED`) -> Timeline updates

4. Forum Flow:
Public read -> Authenticated create/reply

5. Error Observability Flow:
Client captures error -> `/api/system/client-errors` -> Admin views logs and exports CSV

---

## Constraints

- Keep implementation demo-friendly but production-minded
- Prefer clear security baselines over complexity
- Preserve modular architecture for future upgrades

---

## Development Rules

- Keep code modular and route-driven
- Update `docs/todo.md` when priorities change
- Append major changes in `docs/logs.md`
- Track regressions and root causes in `docs/bugs.md`
