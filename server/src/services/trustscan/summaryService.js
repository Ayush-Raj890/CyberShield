export const buildTrustScanSummary = ({ ssl, headers, domain, reputation }) => {
  const tlsClause = ssl.valid
    ? `valid TLS from ${ssl.issuer}`
    : `TLS validation failed (${ssl.error || "invalid or expired certificate"})`;

  const headerClause = headers.missing.length === 0
    ? "strong browser protection controls"
    : `${headers.missing.slice(0, 3).join(", ")} browser protections missing`;

  let domainClause = "domain intelligence is inconclusive";

  if (!domain.resolves) {
    domainClause = "the domain fails DNS resolution";
  } else if (typeof domain.ageDays === "number" && domain.ageDays < 30) {
    domainClause = `a newly registered domain (${domain.ageDays} days old)`;
  } else if (typeof domain.ageDays === "number" && domain.ageDays < 180) {
    domainClause = `a relatively new domain (${domain.ageDays} days old)`;
  } else if (typeof domain.ageDays === "number") {
    domainClause = `an established domain (${domain.ageDays} days old)`;
  } else {
    domainClause = "partial domain intelligence coverage";
  }

  let reputationClause = "public reputation feeds were unavailable";

  if (reputation?.listed) {
    reputationClause = `${reputation.source} flagged this target`;
  } else if (reputation?.grade === "Clean") {
    reputationClause = `${reputation.source} found no known public listings`;
  }

  return `Site has ${tlsClause}, ${headerClause}, ${domainClause}, and ${reputationClause}.`;
};
