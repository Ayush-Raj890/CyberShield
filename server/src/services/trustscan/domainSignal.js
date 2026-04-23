import { promises as dns } from "dns";
import { withTimeout } from "./networkUtils.js";
import { lookupDomainAgeDays } from "./rdapService.js";
import { getRegistrableDomain, normalizeTarget } from "./urlUtils.js";

const DNS_TIMEOUT_MS = 3500;

const safeDnsLookup = async (lookupPromise) => {
  try {
    const records = await withTimeout(lookupPromise, DNS_TIMEOUT_MS);
    return {
      records: Array.isArray(records) ? records : [],
      errorType: null,
      errorCode: null
    };
  } catch (error) {
    const message = String(error?.message || "").toLowerCase();
    const isTimeout = message.includes("timed out");

    return {
      records: [],
      errorType: isTimeout ? "timeout" : "lookup_error",
      errorCode: typeof error?.code === "string" ? error.code : null
    };
  }
};

const getDnsRecords = async (hostname) => {
  const lookupDomain = getRegistrableDomain(hostname) || hostname;

  const [aResult, aaaaResult, cnameResult, mxResult, nsResult, ageDays] = await Promise.all([
    safeDnsLookup(dns.resolve4(hostname)),
    safeDnsLookup(dns.resolve6(hostname)),
    safeDnsLookup(dns.resolveCname(hostname)),
    safeDnsLookup(dns.resolveMx(lookupDomain)),
    safeDnsLookup(dns.resolveNs(lookupDomain)),
    lookupDomainAgeDays(lookupDomain)
  ]);

  const aRecords = aResult.records;
  const aaaaRecords = aaaaResult.records;
  const cnameRecords = cnameResult.records;
  const mxRecords = mxResult.records;
  const nsRecords = nsResult.records;
  const resolves = [...aRecords, ...aaaaRecords, ...cnameRecords].length > 0;

  const resolutionResults = [aResult, aaaaResult, cnameResult];
  const resolutionCodes = resolutionResults
    .map((result) => result.errorCode)
    .filter((code) => Boolean(code));
  const hasResolutionLookupErrors = resolutionResults.some((result) => Boolean(result.errorType));
  const isNxDomain = !resolves && resolutionCodes.some((code) => ["ENOTFOUND", "ENODATA", "EAI_NONAME"].includes(code));
  const hasTransientResolutionIssue = !resolves && hasResolutionLookupErrors && !isNxDomain;

  return {
    lookupDomain,
    resolves,
    mx: mxRecords.length > 0,
    ageDays,
    nameservers: nsRecords.length,
    isNxDomain,
    hasTransientResolutionIssue,
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

    if (records.resolves) {
      scoreDelta += 5;
    }

    if (records.isNxDomain) {
      scoreDelta -= 40;
    }

    if (typeof records.ageDays === "number") {
      if (records.ageDays < 30) {
        scoreDelta -= 20;
      } else if (records.ageDays >= 730) {
        scoreDelta += 10;
      }
    }

    scoreDelta = Math.max(-40, Math.min(20, scoreDelta));

    let grade = "Neutral";
    if (records.isNxDomain) {
      grade = "Broken";
    } else if (typeof records.ageDays === "number" && records.ageDays < 30) {
      grade = "Suspicious";
    } else if (scoreDelta <= -20) {
      grade = "Suspicious";
    } else if (scoreDelta >= 10) {
      grade = "Strong";
    } else if (scoreDelta >= 5) {
      grade = "Fair";
    } else if (!records.resolves && records.hasTransientResolutionIssue) {
      grade = "Neutral";
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
      reason: records.hasTransientResolutionIssue ? "network_error" : "success"
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
