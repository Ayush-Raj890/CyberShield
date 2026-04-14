# TrustScan Product Spec (V3)

## Objective
Enable users to submit a URL and receive a safe, explainable trust report without intrusive scanning.

## Primary Flow
1. User enters a URL.
2. Frontend validates basic format and submits scan request.
3. Backend creates async scan job.
4. Worker executes passive checks.
5. Results are stored and scored.
6. Frontend polls for job completion.
7. User sees scorecard and detailed report.

## User Experience Requirements
- Fast submission feedback (job accepted or rejected)
- Clear progress states: queued, running, completed, failed
- Explainable scorecard, not only a single numeric score
- Report detail sections for evidence and reasoning
- Scan history for authenticated users
- Clear messaging for limits and temporary throttling

## Functional Scope
- URL normalization and canonicalization
- passive intelligence checks (TLS, DNS, headers, reputation)
- weighted scoring model
- AI summary overlay for non-technical users
- report persistence and retrieval

## Non-Goals (V3)
- exploit execution
- brute force checks
- authenticated penetration workflows
- intrusive network probing

## Limits and Guardrails
- request rate limits per user and IP
- max scan frequency controls
- policy-based blocklist for prohibited targets
- legal-safe passive scanning boundary

## Success Metrics
- scan completion rate
- median completion time
- user return rate for repeated checks
- false-confidence incident count (should trend down)
- moderation incidents from misuse (should remain low)
