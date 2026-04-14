export const buildTrustScanSummary = ({ ssl, headers, domain }) => {
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

  return `Site has ${tlsClause}, ${headerClause}, and ${domainClause}.`;
};
