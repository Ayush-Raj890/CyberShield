# CyberShield Security Notes

## Security Posture

CyberShield applies layered security controls across transport, input handling, auth, and abuse prevention.

## Controls Implemented

### 1. Authentication and Access

- JWT-based protected routes
- Role-based authorization (`USER`, `ADMIN`, `SUPER_ADMIN`)
- OTP verification during registration
- Password reset via time-bound token

### 2. Input Validation and Sanitization

- Request validation on key auth/report/system routes
- XSS sanitization middleware
- NoSQL operator sanitization middleware
- MIME/type guards for uploads

### 3. Abuse Prevention

- Global API limiter
- Endpoint-specific limiters:
  - register/login/resend OTP
  - verify OTP
  - forgot/reset password
  - AI predict
- Upload size limits and report feed constraints

### 4. Transport and Headers

- Helmet security headers
- CORS origin allowlist with environment control
- Trusted proxy setting for hosted environments

### 5. Logging and Observability

- Structured error and security warnings remain enabled
- Verbose request/auth flow logging is env-gated via `DEBUG_REQUEST_LOGS`
- Sensitive values (OTP/token) are not logged in normal debug paths
- Client-side runtime error capture endpoint for admin diagnostics

## Operational Guidance

### Development

- Set `DEBUG_REQUEST_LOGS=true` for local diagnostics.
- Use `EMAIL_MOCK=true` unless end-to-end SMTP testing is required.

### Production

- Keep `DEBUG_REQUEST_LOGS=false`.
- Use strong secrets (`JWT_SECRET`, `OTP_HASH_SECRET`, `ENCRYPTION_KEY`).
- Restrict `ALLOWED_ORIGINS` to deployed frontends only.
- Rotate credentials and review rate-limit thresholds by traffic profile.

## Known Gaps / Future Hardening

- Add centralized structured log sink (for example ELK/Datadog/OpenSearch)
- Add dependency vulnerability scanning in CI
- Add audit trail for high-risk admin actions
- Consider refresh-token session management for longer-lived sessions
- Add optional captcha for repeated auth abuse attempts
