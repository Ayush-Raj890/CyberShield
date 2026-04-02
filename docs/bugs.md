# Bug Tracker

## Bug 1

Description: Frontend redirected to `/500` too aggressively on non-5xx failures.

Status: Fixed

Fix: Axios interceptor updated to redirect only on explicit 5xx status codes.

---

## Bug 2

Description: Registration crashed with `Cannot set property query ... has only a getter` under Express 5.

Status: Fixed

Fix: Replaced incompatible sanitizers with custom `xssMiddleware` and `sanitizeMiddleware`.

---

## Bug 3

Description: Users could get stuck as unverified and blocked by duplicate email registration.

Status: Fixed

Fix: Register flow now removes prior unverified record and recreates fresh OTP state.

---

## Bug 4

Description: OTP brute-force risk due to unlimited verification attempts.

Status: Fixed

Fix: Added `failedOtpAttempts` limit (max 5), attempt counter reset on resend/verify success, and attempts-remaining feedback.

---

## Bug 5

Description: Public home page JSX failed due to missing closing section tag.

Status: Fixed

Fix: Added missing closing `</section>` tag in home page layout.

---

## Bug 6

Description: Emails with dots in local-part (e.g. `abc.def@gmail.com`) were being altered during auth validation.

Status: Fixed

Fix: Removed dot-pruning normalization behavior and replaced it with trim + lowercase sanitization that preserves local-part punctuation across register/login/verify/resend/reset flows.

---

## Operational Note

Description: Gmail SMTP can reject credentials (`535 BadCredentials`) when not using App Password.

Status: Mitigated

Fix: Added `EMAIL_MOCK` mode for local dev and documented App Password requirement.

---

## Rules

- Always log bugs immediately
- Include root cause and resolution
- Link to affected module when possible
