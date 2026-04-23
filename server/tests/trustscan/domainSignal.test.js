import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  resolve4: vi.fn(),
  resolve6: vi.fn(),
  resolveCname: vi.fn(),
  resolveMx: vi.fn(),
  resolveNs: vi.fn(),
  withTimeout: vi.fn(),
  lookupDomainAgeDays: vi.fn(),
  normalizeTarget: vi.fn(),
  getRegistrableDomain: vi.fn()
}));

vi.mock("dns", () => ({
  promises: {
    resolve4: mocks.resolve4,
    resolve6: mocks.resolve6,
    resolveCname: mocks.resolveCname,
    resolveMx: mocks.resolveMx,
    resolveNs: mocks.resolveNs
  }
}));

vi.mock("../../src/services/trustscan/networkUtils.js", () => ({
  withTimeout: mocks.withTimeout
}));

vi.mock("../../src/services/trustscan/rdapService.js", () => ({
  lookupDomainAgeDays: mocks.lookupDomainAgeDays
}));

vi.mock("../../src/services/trustscan/urlUtils.js", () => ({
  normalizeTarget: mocks.normalizeTarget,
  getRegistrableDomain: mocks.getRegistrableDomain
}));

import { checkDomainSignals } from "../../src/services/trustscan/domainSignal.js";

describe("checkDomainSignals", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.normalizeTarget.mockReturnValue({ hostname: "www.example.com" });
    mocks.getRegistrableDomain.mockReturnValue("example.com");
    mocks.withTimeout.mockImplementation(async (promise) => promise);

    mocks.resolve4.mockResolvedValue([]);
    mocks.resolve6.mockResolvedValue([]);
    mocks.resolveCname.mockResolvedValue([]);
    mocks.resolveMx.mockResolvedValue([]);
    mocks.resolveNs.mockResolvedValue([]);
    mocks.lookupDomainAgeDays.mockResolvedValue(null);
  });

  it("returns positive score for resolving old domain with MX and NS", async () => {
    mocks.resolve4.mockResolvedValue(["1.2.3.4"]);
    mocks.resolveMx.mockResolvedValue([{ exchange: "mail.example.com", priority: 10 }]);
    mocks.resolveNs.mockResolvedValue(["ns1.example.com", "ns2.example.com"]);
    mocks.lookupDomainAgeDays.mockResolvedValue(1000);

    const result = await checkDomainSignals("https://www.example.com");

    expect(result.resolves).toBe(true);
    expect(result.mx).toBe(true);
    expect(result.scoreDelta).toBe(15);
    expect(result.grade).toBe("Strong");
    expect(result.checkedDomain).toBe("example.com");
  });

  it("returns broken when resolvers indicate NXDOMAIN", async () => {
    const nxDomainError = Object.assign(new Error("getaddrinfo ENOTFOUND"), { code: "ENOTFOUND" });
    mocks.resolve4.mockRejectedValue(nxDomainError);
    mocks.resolve6.mockRejectedValue(nxDomainError);
    mocks.resolveCname.mockRejectedValue(nxDomainError);
    mocks.withTimeout.mockImplementation(async (promise) => {
      try {
        return await promise;
      } catch (error) {
        throw error;
      }
    });

    const result = await checkDomainSignals("https://www.example.com");

    expect(result.resolves).toBe(false);
    expect(result.scoreDelta).toBe(-40);
    expect(result.grade).toBe("Broken");
  });

  it("marks newly registered domain as suspicious", async () => {
    mocks.resolve4.mockResolvedValue(["8.8.8.8"]);
    mocks.resolveNs.mockResolvedValue(["ns1.example.com", "ns2.example.com"]);
    mocks.lookupDomainAgeDays.mockResolvedValue(19);

    const result = await checkDomainSignals("https://www.example.com");

    expect(result.resolves).toBe(true);
    expect(result.mx).toBe(false);
    expect(result.scoreDelta).toBe(-15);
    expect(result.grade).toBe("Suspicious");
  });

  it("does not penalize missing MX records when domain resolves", async () => {
    mocks.resolve4.mockResolvedValue(["8.8.8.8"]);
    mocks.resolveNs.mockResolvedValue(["ns1.example.com"]);
    mocks.lookupDomainAgeDays.mockResolvedValue(400);

    const result = await checkDomainSignals("https://www.example.com");

    expect(result.mx).toBe(false);
    expect(result.scoreDelta).toBe(5);
    expect(result.grade).toBe("Fair");
  });

  it("treats transient DNS failures as neutral network issues", async () => {
    const timeoutError = new Error("Operation timed out");
    mocks.resolve4.mockRejectedValue(timeoutError);
    mocks.resolve6.mockRejectedValue(timeoutError);
    mocks.resolveCname.mockRejectedValue(timeoutError);
    mocks.withTimeout.mockImplementation(async (promise) => {
      try {
        return await promise;
      } catch (error) {
        throw error;
      }
    });

    const result = await checkDomainSignals("https://www.example.com");

    expect(result.resolves).toBe(false);
    expect(result.scoreDelta).toBe(0);
    expect(result.grade).toBe("Neutral");
    expect(result.reason).toBe("network_error");
  });

  it("keeps RDAP age lookup failures neutral", async () => {
    mocks.resolve4.mockResolvedValue(["8.8.8.8"]);
    mocks.resolveMx.mockResolvedValue([{ exchange: "mail.example.com", priority: 10 }]);
    mocks.resolveNs.mockResolvedValue(["ns1.example.com", "ns2.example.com"]);
    mocks.lookupDomainAgeDays.mockResolvedValue(null);

    const result = await checkDomainSignals("https://www.example.com");

    expect(result.ageDays).toBeNull();
    expect(result.scoreDelta).toBe(5);
    expect(result.grade).toBe("Fair");
  });

  it("penalizes newly registered domains when they do resolve", async () => {
    mocks.resolve4.mockResolvedValue(["8.8.8.8"]);
    mocks.resolveNs.mockResolvedValue(["ns1.example.com", "ns2.example.com"]);
    mocks.lookupDomainAgeDays.mockResolvedValue(10);

    const result = await checkDomainSignals("https://www.example.com");

    expect(result.resolves).toBe(true);
    expect(result.scoreDelta).toBe(-15);
    expect(result.grade).toBe("Suspicious");
  });
});
