# Development Logs

## Day 1

- Initialized project structure
- Created frontend and backend

## Day 2

- Implemented authentication APIs

## Day 3

- Built report submission feature

## Day 4

- Setup top-level MVP project structure folders (`client`, `server`, `ai-service`, `docs`)

## Day 5

- Added Report module (schema, controller, routes)
- Added auth and role middlewares for protected/admin report access
- Connected `/api/reports` route in backend app

## Day 6

- Setup FastAPI AI service with `/api/predict` endpoint
- Implemented MVP scam detector (keyword-based classifier)
- Integrated backend AI service via axios and added `/api/ai/predict` route

## Day 7

- Updated docs to reflect AI service setup, backend AI integration, and current run endpoints

## Day 8

- Implemented Knowledge Hub backend module (Article model, controller, routes)
- Added public article read APIs and admin-only article creation API
- Connected `/api/articles` route in backend app

## Day 9
- Implemented Admin Dashboard backend module (controller with privileged APIs)
- Built dashboard stats endpoint (total users, reports, articles, pending reports)
- Added user management APIs (list all users, delete user)
- Enhanced report management with admin-only view of all reports
- Added article deletion API for admin cleanup
- Connected `/api/admin` route with protect + adminOnly middleware

## Day 10
- Initialized React frontend with Vite + Tailwind CSS
- Created app structure with React Router for navigation
- Built 7 main pages: Home, Login, Register, Dashboard, ReportIncident, KnowledgeHub, AdminDashboard
- Implemented auth flow (login/register with token storage)
- Connected frontend to backend APIs via axios
- Added protected routes and role-based dashboard access
- Setup client folder with vite.config.js, tailwind config, and .gitignore

## Day 11
- Refactored auth flow into modular structure (`pages/auth`, `routes`, `services`)
- Added reusable Navbar component and protected route wrapper
- Added User Dashboard page as navigation hub
- Added Create Report page and View Reports page under `pages/reports`
- Updated route map with protected routes for `/dashboard`, `/create-report`, and `/reports`
- Fixed PostCSS and Tailwind config for ESM (`export default`) to resolve Vite startup errors

## Day 12
- Added AI Detector frontend page under `pages/ai/ScamDetector.jsx`
- Added Knowledge Hub frontend pages under `pages/knowledge/Articles.jsx` and `pages/knowledge/ArticleDetail.jsx`
- Connected protected routes for `/ai`, `/articles`, and `/articles/:id`
- Verified Vite startup after route integration

## Day 13
- Added admin frontend pages under `pages/admin` (AdminDashboard, ManageReports, ManageUsers, ManageArticles)
- Added reusable `AdminNavbar` for admin navigation
- Added protected admin routes (`/admin`, `/admin/reports`, `/admin/users`, `/admin/articles`)
- Upgraded `PrivateRoute` to support `adminOnly` access control
- Verified frontend startup after admin module integration

## Day 14
- Applied controlled UI polish with global design utilities in `index.css` (`.card`, `.btn`, `.input`)
- Upgraded both navbars to a cleaner, consistent top layout
- Polished user dashboard cards with clearer hierarchy and navigation actions
- Polished report forms/cards with consistent spacing, typography, and status colors
- Upgraded AI detector result UI to high-impact colored outcome card
- Upgraded article list cards for cleaner Knowledge Hub presentation
- Polished admin dashboard stats cards and all admin management screens
- Verified frontend startup after UI refinement pass

## Day 15
- Installed `lucide-react` and `react-hot-toast` for lightweight premium UX
- Upgraded global design system with gradient background, refined cards, buttons, and focused input states
- Added icon-based premium Navbar navigation
- Upgraded dashboard cards with icon hierarchy and stronger content structure
- Replaced `alert()` flows with toast notifications in auth, reports, AI, and admin actions
- Added loading states for login/register/report submit/AI analysis/admin CRUD actions
- Upgraded AI result card with gradient severity styling for demo impact
- Verified frontend startup after premium UI integration

## Day 17
- Added frontend validation for login/register forms (email format + password length guard)
- Added backend validation in auth controller for register/login (required fields, email format, password length)
- Upgraded AI predictor service logic to scoring-based keyword detection
- Added triage prediction output classes in AI service: SAFE, SUSPICIOUS, MALICIOUS
- Installed security packages: helmet, xss-clean, express-validator, express-mongo-sanitize
- Added global security middleware to app.js: helmet (secure headers), xss-clean (XSS prevention), mongo-sanitize (NoSQL injection prevention)
- Added express-validator middleware to auth routes for request validation/sanitization (name, email, password)
- Added validation error handling in auth controller (register/login)
- Added express-validator middleware to report routes for request validation/sanitization (title, description, category)
- Added validation error handling in report controller (createReport)
- Created frontend sanitizer utility (`utils/sanitizer.js`) with cleanInput and sanitizeObject functions
- Updated auth pages (Login/Register) to use frontend sanitizer before API calls
- Updated CreateReport page to use frontend sanitizer before API calls
- Comprehensive AppSec layer complete: backend validation, sanitization, injection prevention, frontend light layer

## Day 18
- Installed multer for file upload handling
- Created upload middleware with file type filtering (images, PDFs)
- Created uploads directory for file storage
- Updated app.js to serve static files from /uploads path
- Enhanced Report model with severity (LOW/MEDIUM/HIGH) and contactEmail fields
- Added validation/sanitization for severity and contactEmail in report routes
- Updated report controller to handle file uploads and save evidence file paths
- Enhanced Article model with status field (PENDING/APPROVED/REJECTED) for approval workflow
- Updated article routes to allow any authenticated user to submit articles
- Added admin-only endpoints: GET /articles/admin/pending, PUT /articles/:id/status
- Updated article controller to set status PENDING for user submissions and only show APPROVED articles publicly
- Enhanced getArticles to populate creator info and filter by approval status
- Updated CreateReport form to include severity dropdown, contact email, and file upload
- Updated CreateReport to use FormData for multipart file uploads
- Enhanced ViewReports to display severity badges, contact email, and evidence images/documents
- Updated Articles page to include user article submission form with toggle
- Redesigned ManageArticles admin page with two tabs: pending articles (approve/reject) and published articles (delete)
- Added admin approval/rejection workflow with side-by-side buttons and creator contact info
- Industry-level feature set complete: user-generated content + file uploads + admin moderation

## Day 19
- Added public Home page and moved login route to `/login`
- Switched `/ai`, `/articles`, `/articles/:id`, and `/reports` to public frontend routes
- Opened backend read endpoints for AI prediction and report listing while keeping create/update protected
- Extended user role model to include `SUPER_ADMIN`
- Added user suspension support (`isSuspended`) in user model
- Enforced suspended-user blocking in auth middleware and login flow
- Expanded admin middleware to include `SUPER_ADMIN`; added `superAdminOnly` guard
- Added admin user governance APIs: promote, suspend, and super-admin demote
- Updated admin users UI with Make Admin, Suspend, and Remove Admin actions
- Added super-admin CLI helper script and npm command: `make:super-admin`

## Day 20
- Added email OTP verification flow for auth (register -> verify -> login)
- Added `/api/auth/verify-otp` endpoint with validation
- Added `/api/auth/resend-otp` endpoint with validation
- Added resend OTP UX with 30-second cooldown timer on Verify page
- Added OTP brute-force protection with max 5 attempts per OTP session
- Added remaining-attempts payload in verify OTP error responses for better UX
- Fixed unverified-user re-registration trap by deleting prior unverified account before new registration
- Added optional mock email mode (`EMAIL_MOCK=true`) for local development without SMTP
- Replaced Express 5-incompatible sanitization middleware with custom safe middlewares

## Day 21

- Added premium public Home page redesign with guided onboarding sections
- Added clear forum access guidance and CTA pathways from home page
- Implemented frontend Community Forum module (`/forum`)
- Implemented standalone protected Create Post page (`/forum/create`)
- Added auth-gated forum posting and reply flows in UI
- Added forum discoverability in shared Navbar and User Dashboard cards
- Added global route wiring for forum pages in AppRoutes

## Day 22

- Fixed broken JSX structure in public Home page (missing closing section tag)
- Performed full docs-folder synchronization with current implemented state

## Day 23

- Implemented User Profile backend module (`/api/users/profile`, `/api/users/change-password`)
- Added ownership stats in profile API (reports, articles, forum posts)
- Added personalization fields in User model (alias, bio)
- Added secure password change flow with current password verification and hash update
- Added protected frontend Profile page (`/profile`) with stats and profile/password forms
- Added profile discoverability in shared Navbar

---

## Notes
- Always log what was done
- Keep entries short and clear
