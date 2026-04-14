export const getTrustScanConfidence = ({ ssl, headers, domain }) => {
  const sslReady = Boolean(ssl) && (ssl.issuer !== "Unknown" || ssl.expiresAt !== null || typeof ssl.daysRemaining === "number");
  const headersReady = Boolean(headers) && Boolean(headers.checkedUrl);
  const domainReady = Boolean(domain) && Boolean(domain.checkedDomain);
  const ageReady = typeof domain?.ageDays === "number";

  if (sslReady && headersReady && domainReady && ageReady) {
    return "High";
  }

  if ((sslReady && headersReady && domainReady) || ((sslReady || headersReady) && domainReady)) {
    return "Medium";
  }

  return "Low";
};
