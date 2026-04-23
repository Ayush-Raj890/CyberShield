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
      reason: ssl.reason || "success",
      detail: `Valid certificate from ${ssl.issuer}. Expires at ${ssl.expiresAt || "unknown"} (${expiryText}).`
    };
  }

  return {
    key: "ssl",
    label: "Transport Security",
    impact: -35,
    status: "fail",
    reason: ssl.reason || "network_error",
    detail: `Certificate check failed: ${ssl.error || "invalid or expired certificate"}. Issuer: ${ssl.issuer}.`
  };
};

export const buildHeadersFactor = (headers) => {
  const present = Array.isArray(headers?.present) ? headers.present : [];
  const missing = Array.isArray(headers?.missing) ? headers.missing : [];
  const grade = typeof headers?.grade === "string" ? headers.grade : "Poor";
  const scoreDelta = typeof headers?.scoreDelta === "number" ? headers.scoreDelta : -25;
  const isStrong = grade === "Strong";
  const isGood = grade === "Good";

  return {
    key: "headers",
    label: "Browser Protection Controls",
    impact: scoreDelta,
    status: isStrong || isGood ? "pass" : missing.length <= 3 ? "warn" : "fail",
    reason: headers?.reason || "success",
    detail: `${grade} browser protection posture. Present: ${present.join(", ") || "none"}. Missing: ${missing.join(", ") || "none"}.`,
    present,
    missing,
    grade
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
    reason: domain.reason || "success",
    detail: `${resolvesText}. ${mxText}. ${nameserverText}. ${ageText}.`,
    resolves: domain.resolves,
    mx: domain.mx,
    ageDays: domain.ageDays,
    nameservers: domain.nameservers,
    grade: domain.grade,
    checkedDomain: domain.checkedDomain
  };
};

export const buildReputationFactor = (reputation) => {
  if (reputation.listed) {
    return {
      key: "reputation",
      label: "Reputation Signals",
      impact: reputation.scoreDelta,
      status: "fail",
      reason: reputation.reason || "success",
      detail: `${reputation.source}: flagged in public threat feeds.`,
      listed: true,
      source: reputation.source,
      grade: reputation.grade,
      checkedUrl: reputation.checkedUrl
    };
  }

  if (reputation.grade === "Clean") {
    return {
      key: "reputation",
      label: "Reputation Signals",
      impact: reputation.scoreDelta,
      status: "pass",
      reason: reputation.reason || "success",
      detail: `${reputation.source}: no public threat feed matches found.`,
      listed: false,
      source: reputation.source,
      grade: reputation.grade,
      checkedUrl: reputation.checkedUrl
    };
  }

  return {
    key: "reputation",
    label: "Reputation Signals",
    impact: 0,
    status: "warn",
    reason: reputation.reason || "service_unavailable",
    detail: reputation.detail || `${reputation.source}: reputation lookup unavailable.`,
    listed: false,
    source: reputation.source,
    grade: reputation.grade || "Unknown",
    checkedUrl: reputation.checkedUrl,
    error: reputation.error || null
  };
};

export const createPlaceholderFactors = () => [];
