# Refactor Log

## Commit 4 - Entropy Audit + Cleanup

Date: 2026-04-11

### Audit findings

- Oversized frontend files detected (>250 lines):
  - `client/src/pages/knowledge/Articles.jsx` (~442 lines)
  - `client/src/pages/admin/ErrorLogs.jsx` (~281 lines)
- Duplicate runtime URL helper logic existed in multiple places:
  - `client/src/App.jsx`
  - `client/src/services/api.js`
  - `client/src/utils/errorReporter.js`
- Duplicate filter parameter construction logic existed in:
  - `client/src/pages/admin/ErrorLogs.jsx` (`fetchLogs` and `exportCsv`)
- No unresolved merge markers were found in project source/docs during the latest merge sweep.

### Cleanup performed

- Added shared runtime config helper:
  - `client/src/utils/runtimeConfig.js`
  - Exposes `getApiBaseUrl()` and `getAiServiceBaseUrl()`
- Rewired runtime URL consumers to use shared helper:
  - `client/src/App.jsx`
  - `client/src/services/api.js`
  - `client/src/utils/errorReporter.js`
- Standardized fallback API base behavior to `http://localhost:5000/api` via shared helper.
- Extracted repeated error-log filter builder into one function:
  - `buildFilterParams()` in `client/src/pages/admin/ErrorLogs.jsx`

### Follow-up targets (not changed in this commit)

- Break down `client/src/pages/knowledge/Articles.jsx` into smaller presentational modules.
- Break down `client/src/pages/admin/ErrorLogs.jsx` into table/filter/export subcomponents.
- Extend route-config usage beyond navbar/app routes to high-traffic pages for path consistency.
