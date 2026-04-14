# TrustScan Scoring Model

## Goal
Produce a transparent trust score that explains why a URL appears safer or riskier.

## Score Range
- 0 to 100
- higher is better

Suggested interpretation:
- 80 to 100: low risk
- 50 to 79: medium risk
- 0 to 49: high risk

## Example Weighting Rules
- SSL expired: -30
- Domain appears on blacklist: -70
- Missing Content-Security-Policy header: -8
- Newly registered domain: -15
- Good reputation from trusted source: +20

## Factor Categories
- Transport security (TLS, cert validity)
- Infrastructure signals (DNS and hosting patterns)
- Reputation signals (known bad or trusted sources)
- Header hygiene and baseline web hardening
- Domain lifecycle indicators (age, registration recency)

## Scoring Process
1. collect passive signals
2. normalize values to internal factor format
3. apply weighted adjustments
4. clamp result to 0..100
5. generate human-readable rationale

## Design Principles
- explainability over black-box scoring
- consistent output for same inputs
- conservative confidence when signals are weak
- avoid hard claims from sparse data

## Future Extensions
- confidence bands tied to signal quality
- historical drift detection for domain behavior
- organization-specific risk profiles in SaaS mode
