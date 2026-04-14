import { describe, expect, it } from "vitest";
import { buildTrustScanSummary } from "../../src/services/trustscan/summaryService.js";

describe("buildTrustScanSummary", () => {
  it("summarizes valid TLS, missing protections, and new domain", () => {
    const result = buildTrustScanSummary({
      ssl: { valid: true, issuer: "Lets Encrypt" },
      headers: { missing: ["CSP"] },
      domain: { resolves: true, ageDays: 19 }
    });

    expect(result).toBe("Site has valid TLS from Lets Encrypt, CSP browser protections missing, and a newly registered domain (19 days old)." );
  });

  it("summarizes failed TLS with DNS failure", () => {
    const result = buildTrustScanSummary({
      ssl: { valid: false, error: "handshake timed out" },
      headers: { missing: [] },
      domain: { resolves: false, ageDays: null }
    });

    expect(result).toBe("Site has TLS validation failed (handshake timed out), strong browser protection controls, and the domain fails DNS resolution.");
  });

  it("summarizes established domain and strong headers", () => {
    const result = buildTrustScanSummary({
      ssl: { valid: true, issuer: "DigiCert" },
      headers: { missing: [] },
      domain: { resolves: true, ageDays: 1000 }
    });

    expect(result).toBe("Site has valid TLS from DigiCert, strong browser protection controls, and an established domain (1000 days old)." );
  });
});
