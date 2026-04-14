# TrustScan Architecture (V3)

## Pipeline Overview
1. URL Input
2. Normalize
3. Queue Job
4. Worker Executes Checks
5. Store Results
6. AI Summary
7. Frontend Polling

## Component Responsibilities

### Frontend
- accepts URL input and basic validation
- submits scan request
- polls job status endpoint
- renders progress, scorecard, and report details

### Backend API
- validates request and enforces rate limits
- normalizes URL and creates job record
- exposes job status and report retrieval APIs
- enforces access control and policy checks

### TrustScan Worker
- consumes queued jobs
- runs passive checks (DNS, TLS, headers, reputation)
- writes factor results and intermediate progress
- produces final score input payload

### AI Service
- converts factor payload into readable summary
- returns concise explanation and confidence framing

### Data Layer
- trustscan_jobs: lifecycle state
- trustscan_reports: completed analysis artifact
- optional cache (Redis planned) for hot lookups and throttling support

## Reliability Considerations
- idempotent job creation by request fingerprint
- retries for transient external lookup failures
- timeout guards per check stage
- latest-state persistence for crash recovery

## Security and Safety Controls
- passive scanning only
- target validation and deny rules for prohibited ranges
- per-user and per-IP throttling
- auditable policy gate before worker execution

## Future Scale Direction
- dedicated queue backend
- worker autoscaling by queue depth
- Redis-backed dedupe and response caching
- partitioned storage and retention policies for scan artifacts
