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
    expect(result.scoreDelta).toBe(10);
    expect(result.grade).toBe("Strong");
    expect(result.checkedDomain).toBe("example.com");
  });

  it("returns broken with max penalty when domain does not resolve", async () => {
    const result = await checkDomainSignals("https://www.example.com");

    expect(result.resolves).toBe(false);
    expect(result.scoreDelta).toBe(-55);
    expect(result.grade).toBe("Broken");
  });

  it("marks newly registered domain as suspicious", async () => {
    mocks.resolve4.mockResolvedValue(["8.8.8.8"]);
    mocks.resolveNs.mockResolvedValue(["ns1.example.com", "ns2.example.com"]);
    mocks.lookupDomainAgeDays.mockResolvedValue(19);

    const result = await checkDomainSignals("https://www.example.com");

    expect(result.resolves).toBe(true);
    expect(result.mx).toBe(false);
    expect(result.scoreDelta).toBe(-30);
    expect(result.grade).toBe("Suspicious");
  });

  it("applies only mild penalty when MX is missing", async () => {
    mocks.resolve4.mockResolvedValue(["8.8.8.8"]);
    mocks.resolveNs.mockResolvedValue(["ns1.example.com"]);
    mocks.lookupDomainAgeDays.mockResolvedValue(400);

    const result = await checkDomainSignals("https://www.example.com");

    expect(result.scoreDelta).toBe(0);
    expect(result.grade).toBe("Fair");
  });

  it("handles RDAP age lookup failures gracefully", async () => {
    mocks.resolve4.mockResolvedValue(["8.8.8.8"]);
    mocks.resolveMx.mockResolvedValue([{ exchange: "mail.example.com", priority: 10 }]);
    mocks.resolveNs.mockResolvedValue(["ns1.example.com", "ns2.example.com"]);
    mocks.lookupDomainAgeDays.mockResolvedValue(null);

    const result = await checkDomainSignals("https://www.example.com");

    expect(result.ageDays).toBeNull();
    expect(result.scoreDelta).toBe(0);
    expect(result.grade).toBe("Fair");
  });
});
