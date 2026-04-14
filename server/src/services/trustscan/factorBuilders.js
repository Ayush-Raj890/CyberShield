export const buildSslFactor = (ssl) => {
  if (ssl.valid) {
    const expiryText = typeof ssl.daysRemaining === "number"
      ? `${ssl.daysRemaining} days remaining`
      : "expiry unknown";

    return {
      key: "ssl",
      label: "Transport Security",
      impact: 15,
      status: "pass",
      detail: `Valid certificate from ${ssl.issuer}. Expires at ${ssl.expiresAt || "unknown"} (${expiryText}).`
    };
  }

  return {
    key: "ssl",
    label: "Transport Security",
    impact: -35,
    status: "fail",
    detail: `Certificate check failed: ${ssl.error || "invalid or expired certificate"}. Issuer: ${ssl.issuer}.`
  };
};

export const buildHeadersFactor = (headers) => {
  const isStrong = headers.grade === "Strong";
  const isGood = headers.grade === "Good";

  return {
    key: "headers",
    label: "Browser Protection Controls",
    impact: headers.scoreDelta,
    status: isStrong || isGood ? "pass" : headers.missing.length <= 3 ? "warn" : "fail",
    detail: `${headers.grade} browser protection posture. Present: ${headers.present.join(", ") || "none"}. Missing: ${headers.missing.join(", ") || "none"}.`,
    present: headers.present,
    missing: headers.missing,
    grade: headers.grade
  };
};

export const buildDomainFactor = (domain) => {
  const ageText = typeof domain.ageDays === "number"
    ? `${domain.ageDays} days old`
    : "domain age unavailable";
  const resolvesText = domain.resolves ? "DNS resolves cleanly" : "DNS resolution failed";
  const mxText = domain.mx ? "MX records present" : "No MX records detected";
  const nameserverText = domain.nameservers > 0
    ? `${domain.nameservers} nameserver${domain.nameservers === 1 ? "" : "s"}`
    : "No nameservers detected";

  let status = "pass";
  if (!domain.resolves) {
    status = "fail";
  } else if (domain.grade === "Suspicious" || domain.scoreDelta < -15) {
    status = "warn";
  }

  return {
    key: "dns",
    label: "Domain Intelligence",
    impact: domain.scoreDelta,
    status,
    detail: `${resolvesText}. ${mxText}. ${nameserverText}. ${ageText}.`,
    resolves: domain.resolves,
    mx: domain.mx,
    ageDays: domain.ageDays,
    nameservers: domain.nameservers,
    grade: domain.grade,
    checkedDomain: domain.checkedDomain
  };
};

export const createPlaceholderFactors = () => [
  {
    key: "headers",
    label: "Security Headers",
    impact: 0,
    status: "pending",
    detail: "Security headers signal is queued for implementation."
  },
  {
    key: "reputation",
    label: "Reputation",
    impact: 0,
    status: "pending",
    detail: "Reputation signal is queued for implementation."
  }
];
