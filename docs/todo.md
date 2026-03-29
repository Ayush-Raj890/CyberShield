# TODO - CyberShield

## 🔴 High Priority

### Phase 1: Setup
- [x] Setup project structure
- [x] Initialize React app with Vite
- [x] Initialize Express server
- [x] Connect frontend with backend

---

### Phase 2: Authentication
- [x] User registration API
- [x] Login API
- [x] JWT authentication
- [x] Protected routes
- [x] Public route model (home + public read pages)
- [x] Suspended account enforcement

---

### Phase 3: Incident Reporting
- [x] Create report model
- [x] Submit report API
- [x] Fetch reports API
- [x] Upload evidence (file upload with multer)
- [x] Enhanced report fields (severity, contact email)

---

### Phase 4: AI Integration
- [x] Create Python API
- [x] Implement scam classifier
- [x] Connect backend to AI API

---

### Phase 5: Knowledge Hub
- [x] Create article model
- [x] Add article API (admin)
- [x] Fetch articles API
- [x] User-submitted articles with approval workflow
- [x] Admin moderation system

---

### Phase 6: Admin Dashboard
- [x] View reports
- [x] Update report status
- [x] Manage users
- [x] Promote user to admin
- [x] Suspend user account
- [x] Demote admin (super admin only)

---

### Phase 7: Deployment
- [ ] Deploy frontend
- [ ] Deploy backend
- [ ] Deploy AI service

---

## 🟡 Medium Priority
- [x] UI improvements (basic functional layout)
- [x] UI polishing pass (design system, cards, status indicators, clean navbars)
- [x] Premium UX pass (icons, toast notifications, loading states)
- [x] Add frontend + backend auth input validation (email format, required fields, password length)
- [x] Application Security (AppSec) implementation:
  - [x] Global security middleware (helmet, xss-clean, mongo-sanitize)
  - [x] Request validation/sanitization on auth endpoints (express-validator)
  - [x] Request validation/sanitization on report endpoints (express-validator)
  - [x] Frontend input sanitization utility (XSS prevention light layer)
  - [x] NoSQL injection prevention (express-mongo-sanitize middleware)
- [x] File upload system for reports (evidence):
  - [x] Multer package and upload middleware
  - [x] Report model enhancements (severity, contactEmail, evidence path)
  - [x] Frontend form with file input and FormData submission
  - [x] Evidence display in report detail pages
- [x] User-submitted content system:
  - [x] Article submission by authenticated users
  - [x] Admin approval workflow
  - [x] Status-based filtering (PUBLIC vs PENDING vs REJECTED)
  - [x] Admin moderation UI with approve/reject buttons
- [ ] Mobile responsiveness
- [x] Add AI Detector frontend page (`/ai`)
- [x] Add Knowledge Hub list/detail frontend routes (`/articles`, `/articles/:id`)
- [x] Split admin frontend into pages (ManageReports, ManageUsers, ManageArticles)
- [x] User Profile module:
  - [x] Backend profile/stats endpoints
  - [x] Backend profile update + password change endpoints
  - [x] User model personalization fields (alias, bio)
  - [x] Frontend `/profile` page with stats and edit forms
  - [x] Navbar discoverability for profile
- [x] Community Forum end-to-end:
  - [x] Forum backend routes/controller/model
  - [x] Public forum listing page (`/forum`)
  - [x] Protected create post route (`/forum/create`)
  - [x] Auth-gated reply flow
  - [x] Navbar and dashboard discoverability
- [ ] Error Logs UX enhancements:
  - [ ] Quick filter presets (Last 24h, Last 7 days)
  - [ ] One-click status filter presets (e.g., Only 5xx)
- [ ] Bonus marks features:
  - [ ] Export reports as PDF
  - [ ] Email notifications (fake/mock service)
  - [ ] Dark mode (global theme toggle)
  - [ ] Activity logs (user/admin action trail)

---

## 🟢 Low Priority
- [x] RBAC baseline enhancements (USER, ADMIN, SUPER_ADMIN)
- [ ] RBAC advanced enhancements (granular permissions, audit logging)