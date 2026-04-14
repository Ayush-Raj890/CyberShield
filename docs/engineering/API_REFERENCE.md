# CyberShield API Reference

Base URL: /api

Auth legend:
- Public: no token required
- Protected: valid JWT required
- Admin: ADMIN or SUPER_ADMIN
- Super Admin: SUPER_ADMIN only

## Auth
- POST /auth/register (Public)
- POST /auth/login (Public)
- POST /auth/verify-otp (Public)
- POST /auth/resend-otp (Public)
- POST /auth/forgot-password (Public)
- POST /auth/reset-password (Public)
- GET /auth/validate (Protected)

## Reports
- POST /reports (Protected)
- GET /reports (Public, rate-limited)
- GET /reports/user (Protected)
- GET /reports/me (Protected)
- PUT /reports/:id (Admin)

## AI
- POST /ai/predict (Public, optional auth, rate-limited)

## TrustScan
Current state:
- V3 TrustScan endpoints are planned and will be documented here once introduced.

Planned endpoint shape (subject to implementation):
- POST /trustscan/jobs (Protected)
- GET /trustscan/jobs/:id (Protected)
- GET /trustscan/reports/:id (Protected)
- GET /trustscan/history (Protected)

## Articles
- GET /articles (Public)
- GET /articles/:id (Public)
- GET /articles/user (Protected)
- POST /articles (Protected)
- POST /articles/:id/vote (Protected)
- GET /articles/admin/pending (Admin)
- PUT /articles/:id/status (Admin)

## Forum
- GET /forum (Public)
- GET /forum/user (Protected)
- POST /forum (Protected)
- POST /forum/:id/reply (Protected)

## Videos
- GET /videos (Public)
- POST /videos (Protected)
- GET /videos/pending (Admin)
- PUT /videos/:id (Admin)

## Memes
- GET /memes (Public)
- POST /memes (Protected)
- POST /memes/:id/vote (Protected, rate-limited)
- GET /memes/admin/flagged (Admin)
- PUT /memes/:id (Admin)

## Users
- GET /users/profile (Protected)
- PUT /users/profile (Protected)
- PUT /users/change-password (Protected)
- DELETE /users/me (Protected)

## Admin
- GET /admin/stats (Admin)
- GET /admin/users (Admin)
- DELETE /admin/users/:id (Admin)
- PUT /admin/promote/:id (Admin)
- PUT /admin/suspend/:id (Admin)
- PUT /admin/users/:id/unsuspend (Admin)
- PUT /admin/demote/:id (Super Admin)
- GET /admin/reports (Admin)
- DELETE /admin/articles/:id (Admin)

## Notifications
- GET /notifications (Admin)
- PUT /notifications/:id/read (Admin)

## System
- GET /system/health (Public)
- GET /system/version (Public)
- GET /system/uptime (Public)
- GET /system/client-errors (Admin)
- GET /system/client-errors/export (Admin)
- POST /system/client-errors (Public)

## Game
- POST /game/reward (Protected)
