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

---

## Notes
- Always log what was done
- Keep entries short and clear
