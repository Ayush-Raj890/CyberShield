import { promises as dns } from "dns";
import { withTimeout } from "./networkUtils.js";
import { lookupDomainAgeDays } from "./rdapService.js";
import { getRegistrableDomain, normalizeTarget } from "./urlUtils.js";

const DNS_TIMEOUT_MS = 3500;

const safeDnsLookup = async (lookupPromise) => {
  try {
    return await withTimeout(lookupPromise, DNS_TIMEOUT_MS);
  } catch {
    return [];
  }
};

const getDnsRecords = async (hostname) => {
  const lookupDomain = getRegistrableDomain(hostname) || hostname;

  const [aRecords, aaaaRecords, cnameRecords, mxRecords, nsRecords, ageDays] = await Promise.all([
    safeDnsLookup(dns.resolve4(hostname)),
    safeDnsLookup(dns.resolve6(hostname)),
    safeDnsLookup(dns.resolveCname(hostname)),
    safeDnsLookup(dns.resolveMx(lookupDomain)),
    safeDnsLookup(dns.resolveNs(lookupDomain)),
    lookupDomainAgeDays(lookupDomain)
  ]);

  return {
    lookupDomain,
    resolves: [...aRecords, ...aaaaRecords, ...cnameRecords].length > 0,
    mx: mxRecords.length > 0,
    ageDays,
    nameservers: nsRecords.length,
    aRecords,
    aaaaRecords,
    cnameRecords,
    mxRecords,
    nsRecords
  };
};

export const checkDomainSignals = async (rawUrl) => {
  try {
    const { hostname } = normalizeTarget(rawUrl);
    const records = await getDnsRecords(hostname);

    let scoreDelta = 0;

    if (!records.resolves) {
      scoreDelta -= 40;
    }

    if (!records.mx) {
      scoreDelta -= 5;
    }

    if (records.nameservers <= 0) {
      scoreDelta -= 10;
    }

    if (typeof records.ageDays === "number") {
      if (records.ageDays < 30) {
        scoreDelta -= 25;
      } else if (records.ageDays < 180) {
        scoreDelta -= 12;
      } else if (records.ageDays >= 730) {
        scoreDelta += 10;
      } else {
        scoreDelta += 5;
      }
    }

    scoreDelta = Math.max(-55, Math.min(20, scoreDelta));

    let grade = "Neutral";
    if (!records.resolves) {
      grade = "Broken";
    } else if (scoreDelta <= -20) {
      grade = "Suspicious";
    } else if (scoreDelta <= -1) {
      grade = "Weak";
    } else if (scoreDelta >= 10) {
      grade = "Strong";
    } else {
      grade = "Fair";
    }

    return {
      resolves: records.resolves,
      mx: records.mx,
      ageDays: records.ageDays,
      nameservers: records.nameservers,
      scoreDelta,
      grade,
      checkedDomain: records.lookupDomain.toLowerCase(),
      records: {
        a: records.aRecords,
        aaaa: records.aaaaRecords,
        cname: records.cnameRecords,
        mx: records.mxRecords,
        ns: records.nsRecords
      },
      reason: "success"
    };
  } catch (error) {
    return {
      resolves: false,
      mx: false,
      ageDays: null,
      nameservers: 0,
      scoreDelta: -55,
      grade: "Broken",
      checkedDomain: null,
      error: error.message || "Domain signal check failed",
      reason: "network_error"
    };
  }
};
