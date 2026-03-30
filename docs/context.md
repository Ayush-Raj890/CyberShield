# Project Context

## Overview

CyberShield is a full-stack cybersecurity platform combining:

- Incident reporting
- AI-based threat triage
- Moderated knowledge sharing
- Community collaboration forum
- Admin governance and monitoring
- Engagement-oriented retention mechanics (planned)

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
10. Mobile responsiveness pass for core user-facing flows
11. Modular dashboard engine (user/admin mode, tab-based, lazy analytics)
12. Gamification foundation (XP, levels, streaks, badges, event rewards)
13. Video Hub submission and moderation pipeline
14. Account settings module with self-service account deletion
15. Meme Hub foundation (implemented): user-generated image memes, community voting, auto-flag moderation, admin review panel
16. Fun & Learn mini-games (planned): interactive quiz modules for phishing/url/password awareness

Simplified items:

- Single AI model/classifier (keyword scoring)
- Monolith backend (no microservice split except AI service)
- No external queue system for background jobs
- Light-only UI theme (dark mode switch planned)

Product strategy shift (planned):

- Move from feature-complete utility experience to habit-forming product loop
- Prioritize retention systems: gamification, short content, and repeat challenge mechanics
- Community-driven moderation is now active for meme content to reduce admin-only load

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
- Video Hub listing
- Meme Hub listing

Authenticated:

- Create report
- Create/reply forum posts
- Article submission
- Video submission
- Meme submission
- Settings management (profile/password/preferences)
- Dashboard tools

Admin / Super Admin:

- User management
- Report moderation
- Article moderation
- Video moderation
- Meme moderation (approve/reject user submissions)
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

5. Identity Display Flow:
Default username display -> If alias exists then show alias -> Hover alias to reveal username

6. Error Observability Flow:
Client captures error -> `/api/system/client-errors` -> Admin views logs and exports CSV

7. Dashboard Data Flow:
Tab-based dashboard -> Fetch real data from APIs -> Compute derived metrics in frontend -> Lazy-load analytics charts only on analytics tab

8. Engagement Loop:
Daily login/activity -> Earn XP and streak progress -> Unlock badges/challenges -> Return for next milestone

9. Learning Loop (Planned):
Consume short-form security content -> Practice via mini-games -> Improve awareness score -> Share/community contribution

10. Video Moderation Flow:
Authenticated user submits video -> status set to `PENDING` -> admin reviews pending queue -> status updated to `APPROVED`/`REJECTED` -> public Video Hub serves approved content only

11. Settings and Danger Zone Flow:
Authenticated user opens settings -> updates alias/bio/password/preferences -> optional account self-delete removes owned records and account

12. Meme Hub Flow:
User uploads meme (image + caption + category) -> status set to `VISIBLE` -> community upvote/downvote -> auto-flag when downvote ratio threshold is crossed -> status becomes `FLAGGED` and hidden from feed -> admin reviews flagged queue -> admin restores `VISIBLE` or marks `REMOVED`

13. Mini Games Flow (Planned):
User plays interactive quiz-based games (Phishing Detector, URL Checker, Password Strength) -> answers scored -> correct answers earn XP -> explanations provided -> contributes to cyber awareness badges

---

## Constraints

- Keep implementation demo-friendly but production-minded
- Prefer clear security baselines over complexity
- Preserve modular architecture for future upgrades
- Keep dashboard component modular and prop-driven (no hardcoded stats)
- Prioritize fast initial load by deferring chart bundles until needed
- Prefer scalable low-cost content systems (embedded links over heavy media hosting)
- Keep gamification logic explainable and deterministic in early versions

---

## Development Rules

- Keep code modular and route-driven
- Update `docs/todo.md` when priorities change
- Append major changes in `docs/logs.md`
- Track regressions and root causes in `docs/bugs.md`
