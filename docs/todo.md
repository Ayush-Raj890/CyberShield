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

### Phase 8: Modular Dashboard System
- [x] Lock architecture and update docs first
- [x] Refactor reusable analytics dashboard component to dynamic props-driven model
- [x] Build tab-based `ClientDashboard` (overview, analytics, reports)
- [x] Build tab-based `AdminDashboard` (overview, analytics, moderation)
- [x] Hook real API sources and frontend-calculated metrics
- [x] Add lazy-loaded charts for analytics tabs only
- [x] Add dark mode ready state wiring (without forcing global theme)
- [ ] Add chart visualization library integration (optional polish)
- [ ] Add role-specific endpoint hardening (`/reports/user`, `/articles/user`, `/forum/user`) to avoid broad fetch + frontend filtering

---

### Phase 9: Retention and Engagement Product Expansion

Priority 1 (must-do):

- [x] Gamification foundation (XP, levels, streak tracking)
- [x] Short video content hub (submission + admin moderation + public approved feed)
- [x] Meme submission + moderation flow (community voting + auto-flag + admin review)
- [x] Dashboard integration for XP, level progress, and engagement KPIs

Priority 2:

- [x] Mini phishing detector game (part of Fun & Learn module)
- [x] Daily streak reward loop
- [x] Badge system foundation (Rookie, Cyber Warrior, Elite Defender)
- [ ] Badge expansion (Meme Lord, Scam Spotter, Cyber Gamer, challenge badges)

Priority 3:

- [ ] Awareness score system
- [ ] Weekly challenge system
- [ ] Activity feed and engagement timeline

Skip for now:

- [ ] Complex multiplayer game modes
- [ ] Real ML behavioral models
- [ ] Heavy animation systems

---

### Phase 10: Meme + Fun Hub (Learning + Engagement)

**Module Purpose:** Gamified learning through memes and interactive quizzes to increase engagement and cybersecurity awareness

**A. Meme Hub** (user-generated, moderated content)

- [x] Meme model and database schema
- [x] File upload system for meme images (multer integration)
- [x] Meme submission API (`POST /api/memes`)
- [x] Meme moderation workflow (community vote-based auto-flag + admin moderation)
- [x] Public visible meme feed (`GET /api/memes`)
- [x] Voting system (upvote/downvote)
- [x] Trending/Latest feed sorting
- [x] Meme category support (SCAM, AWARENESS, FUN)
- [ ] Educational tag differentiation
- [x] Frontend Meme Hub page (`/memes`)
- [x] Frontend meme submission page (`/memes/upload`)
- [x] Admin meme moderation page (`/admin/memes`)

**B. Fun & Learn (Mini Games)** (interactive quiz-based learning)

- [x] Game 1: Phishing Detector (identify phishing messages)
- [ ] Game 2: URL Checker (identify malicious URLs)
- [ ] Game 3: Password Strength Challenge (rate password strength)
- [x] Games scoring and explanations
- [x] XP rewards for correct answers
- [x] Frontend Games hub/page (`/games`)
- [x] Game components and quiz logic

**C. Gamification Integration**

- [x] Update XP rules: meme uploaded (+10), meme liked (+2), game correct answer (+5)
- [ ] New badges: Meme Lord, Scam Spotter, Cyber Gamer
- [x] Dashboard integration showing meme activity and game stats (top meme likes insight)

**D. UI/UX Integration**

- [x] Update Navbar "Learn" section with Memes and Games links
- [x] Add in-page quick-create CTAs for Reports, Video Hub, and Meme Hub
- [x] Responsive meme card components
- [x] Meme card micro-feedback (+XP hint and trending badge)
- [ ] Game UI and feedback systems
- [x] Mobile-responsive meme feed and moderation pages

**E. Virtual Economy Layer**

- [x] Add coin field to user model with starter balance
- [x] Add economy utility for coin earn/spend rules
- [x] Add anti-farming controls (daily cap + cooldowns + diminishing rewards)
- [x] Daily login coin rewards
- [x] Meme upload coin spend + reward flow
- [x] Meme like receiver coin rewards
- [x] Downvote coin cost
- [x] Forum post/reply coin costs
- [x] Navbar coin balance display
- [x] Dashboard coin display + low coin warning
- [x] Dashboard wallet snapshot (remaining daily budget + UTC reset hint)
- [x] Local user coin sync after meme actions

**DECISION POINTS (confirm before implementation):**

- [x] **Meme Upload Type:** A (file upload via multer)
- [x] **Like System:** Simple voting (upvote/downvote)
- [ ] **Games Complexity:** Simple quiz-based (recommended) OR Interactive UI (more complex)?
- [x] **Games Complexity:** Simple quiz-based implementation selected for current release

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
  - [x] Responsive Navbar and AdminNavbar wrapping/stacking
  - [x] Responsive spacing/buttons for profile, reports, forum, articles, and AI pages
  - [ ] Final QA pass for auth/admin screens and edge-width devices
- [x] Add AI Detector frontend page (`/ai`)
- [x] Add Knowledge Hub list/detail frontend routes (`/articles`, `/articles/:id`)
- [x] Split admin frontend into pages (ManageReports, ManageUsers, ManageArticles)
- [x] User Profile module:
  - [x] Backend profile/stats endpoints
  - [x] Backend profile update + password change endpoints
  - [x] User model personalization fields (alias, bio)
  - [x] Frontend `/profile` page with stats and edit forms
  - [x] Navbar discoverability for profile
  - [x] Identity UX rule (alias-first display + username on hover)
- [x] Settings module:
  - [x] Frontend `/settings` page (profile, password, local preferences)
  - [x] Backend self-delete endpoint (`DELETE /api/users/me`)
  - [x] Danger Zone account deletion flow in UI
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
  - [ ] Dark mode switch (global theme toggle + localStorage persistence)
  - [ ] Activity logs (user/admin action trail)
  - [ ] Profile picture upload
  - [ ] Recent activity section on profile page
  - [ ] Badge system (e.g., Top Contributor)

---

## 🟢 Low Priority
- [x] RBAC baseline enhancements (USER, ADMIN, SUPER_ADMIN)
- [ ] RBAC advanced enhancements (granular permissions, audit logging)