# CyberShield

CyberShield is an AI-powered cyber awareness and incident reporting platform that helps users detect scams, report threats, and learn safe digital practices.

## Live Deployments

| Service | Link |
| --- | --- |
| Frontend | [cyber-shield-eight.vercel.app](https://cyber-shield-eight.vercel.app) |
| Preview Frontend | [cyber-shield-nzeoni1oj-mystifys-projects.vercel.app](https://cyber-shield-nzeoni1oj-mystifys-projects.vercel.app) |
| Backend API | [cybershield-backend-inx9.onrender.com](https://cybershield-backend-inx9.onrender.com) |
| AI Service | [cybershield-ai-sm3o.onrender.com](https://cybershield-ai-sm3o.onrender.com) |

## Overview

CyberShield helps users:

- Detect suspicious messages using AI-assisted triage
- Report cyber incidents with evidence
- Learn cybersecurity best practices
- Participate in moderated community content
- Enable admins to govern users, content, and platform safety

It combines React, Node.js, MongoDB, and FastAPI in a multi-service architecture.

## Core Features

### AI Scam Detection

- Analyze suspicious text and messages
- Risk labels: `SAFE`, `SUSPICIOUS`, `MALICIOUS`
- Confidence scoring and explanation
- Direct handoff to report flow

### Incident Reporting

- Structured threat reporting
- File evidence upload for images and PDFs
- Severity levels
- Status lifecycle tracking

### Authentication and Security

- JWT auth
- OTP email verification
- Password reset flow
- Role-based access for `USER`, `ADMIN`, and `SUPER_ADMIN`
- Abuse throttling and rate limits

### Knowledge Hub

- Moderated educational articles
- Public reading and authenticated submissions
- Admin approval pipeline

### Community Modules

- Forum discussions
- Video Hub
- Meme Hub with moderation controls

### Admin Governance

- User management
- Suspend, unsuspend, promote, and demote actions
- Report moderation
- Content moderation
- Error observability dashboard

## Screenshots

Store public screenshots in [assets](assets).

- [Home page](assets/homepage.png)
- [AI detector](assets/ai-detector.png)
- [User dashboard](assets/user-dashboard.png)
- [Admin panel](assets/admin-dashboard.png)
- [Reports](assets/reports-page.png)

## Architecture

```text
Browser (React + Vite)
      ↓
Express Backend API
      ↓
MongoDB Atlas

Express Backend
      ↓
FastAPI AI Service
```

### Service Responsibilities

| Service | Responsibility |
| --- | --- |
| client | UI, routing, UX |
| server | auth, validation, APIs, moderation |
| ai-service | threat classification |

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer

### AI Layer

- FastAPI
- Python

### Security

- JWT
- Helmet
- CORS allowlist
- Sanitization middleware
- Rate limiting

## Security Highlights

- OTP verification during signup
- Password reset token flow
- Protected admin routes
- Input validation and sanitization
- Upload restrictions
- Rate limiting on sensitive endpoints
- Role-based authorization

More details: [docs/public/SECURITY.md](docs/public/SECURITY.md)

## Repository Structure

```text
CyberShield/
├── client/        # React frontend
├── server/        # Express backend
├── ai-service/    # FastAPI ML service
├── docs/public/   # Public-facing documentation
├── docs/internal/ # Internal docs and QA notes
├── scripts/       # Startup scripts
└── assets/        # README images
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB URI

### Install

```bash
npm install
```

### Run Full Stack

```bash
npm run dev
```

### Or Run Individually

#### Backend Setup

```bash
cd server
npm install
npm run dev
```

#### Frontend Setup

```bash
cd client
npm install
npm run dev
```

#### AI Service Setup

```bash
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Environment Variables

### Server

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
AI_SERVICE_URL=http://localhost:8000
ALLOWED_ORIGINS=http://localhost:3000
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
DEBUG_REQUEST_LOGS=false
```

### Client

```env
VITE_API_URL=http://localhost:5000/api
```

## Why This Project Matters

CyberShield demonstrates:

- Full-stack architecture design
- Security-focused engineering
- Real deployment workflow
- Multi-service integration
- Role-based systems
- Product thinking
- Moderation tooling
- Scalable documentation discipline

## Documentation

| File | Purpose |
| --- | --- |
| [docs/public/DEMO.md](docs/public/DEMO.md) | Demo walkthrough |
| [docs/public/SYSTEM_DESIGN.md](docs/public/SYSTEM_DESIGN.md) | Architecture |
| [docs/public/SECURITY.md](docs/public/SECURITY.md) | Security model |
| [docs/internal/README.md](docs/internal/README.md) | Internal docs index |

## Resume Summary

Built and deployed a multi-service cybersecurity platform using React, Express, MongoDB, and FastAPI with AI scam detection, role-based governance, reporting workflows, and production deployment.

## Interview Pitch

CyberShield is an AI-powered cyber awareness platform that helps users identify scams, report incidents, and learn safer digital behavior through an integrated ecosystem.

## Roadmap

- Analytics trends
- Better observability
- Search and filtering polish (completed baseline; ongoing UX tuning)
- Stronger moderation tooling
- ML model upgrades
- Dark mode

## License

MIT

## Author

Built by @Mystify7777.
