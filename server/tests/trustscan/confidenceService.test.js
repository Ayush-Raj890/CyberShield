import { describe, expect, it } from "vitest";
import { getTrustScanConfidence } from "../../src/services/trustscan/confidenceService.js";

describe("getTrustScanConfidence", () => {
  it("returns High when all signals including age are present", () => {
    const result = getTrustScanConfidence({
      ssl: { issuer: "Lets Encrypt", expiresAt: "2030-01-01T00:00:00.000Z", daysRemaining: 120 },
      headers: { checkedUrl: "https://example.com" },
      domain: { checkedDomain: "example.com", ageDays: 600 }
    });

    expect(result).toBe("High");
  });

  it("returns Medium for partial signal coverage", () => {
    const result = getTrustScanConfidence({
      ssl: { issuer: "Unknown", expiresAt: null, daysRemaining: null },
      headers: { checkedUrl: "https://example.com" },
      domain: { checkedDomain: "example.com", ageDays: null }
    });

    expect(result).toBe("Medium");
  });

  it("returns Low for minimal usable signals", () => {
    const result = getTrustScanConfidence({
      ssl: { issuer: "Unknown", expiresAt: null, daysRemaining: null },
      headers: { checkedUrl: "" },
      domain: { checkedDomain: null, ageDays: null }
    });

    expect(result).toBe("Low");
  });
});
