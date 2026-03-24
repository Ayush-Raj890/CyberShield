# Project Context

## Overview

CyberShield is a cybersecurity platform combining:

- Awareness
- Incident reporting
- AI-based threat detection

## Current Scope (MVP)

We are NOT building everything.
We are building a minimal working version with:

### Included Modules

1. Authentication
2. Incident Reporting
3. AI Scam Detection (text-based)
4. Knowledge Hub
5. Admin Dashboard

### Excluded / Simplified

- Community Forum (optional)
- Multiple AI models (only 1 required)
- Complex microservices (keep simple)

---

## Architecture

Frontend (React)
↓
Backend API (Node.js + Express)
↓
MongoDB

AI Service (Python)
↓
Called via API from backend

---

## User Roles

- User
- Admin

---

## Key Flows

### 1. Report Flow

User → Submit Report → Stored in DB → Admin reviews

### 2. AI Flow

User input → Backend → Python AI API → Result returned

---

## Constraints

- Must be simple and working
- Focus on demo, not perfection
- Avoid over-engineering

---

## Development Rules

- Keep code modular
- Always update TODO.md after tasks
- Log progress in logs.md
- Track bugs in bugs.md
