import http from "http";
import https from "https";
import { promises as dns } from "dns";
import { isIP } from "net";
import tls from "tls";

const HEADER_TIMEOUT_MS = 7000;

const SSL_TIMEOUT_MS = 6000;

const DNS_TIMEOUT_MS = 3500;

const AGE_LOOKUP_TIMEOUT_MS = 5000;

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const normalizeTarget = (rawUrl) => {
  const hasProtocol = /^https?:\/\//i.test(rawUrl);
  const parsed = new URL(hasProtocol ? rawUrl : `https://${rawUrl}`);

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only http and https URLs are supported");
  }

  return {
    url: parsed.toString(),
    hostname: parsed.hostname,
    protocol: parsed.protocol,
    port: parsed.port ? Number(parsed.port) : parsed.protocol === "http:" ? 80 : 443
  };
};

const withTimeout = (promise, timeoutMs) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => {
    reject(new Error("Operation timed out"));
  }, timeoutMs);

  promise.then((value) => {
    clearTimeout(timer);
    resolve(value);
  }).catch((error) => {
    clearTimeout(timer);
    reject(error);
  });
});

export const runSslTlsCheck = async (rawUrl) => {
  try {
    const { hostname, port } = normalizeTarget(rawUrl);

    return await new Promise((resolve) => {
      const socket = tls.connect(
        {
          host: hostname,
          port,
          servername: hostname,
          rejectUnauthorized: false
        },
        () => {
          const cert = socket.getPeerCertificate();

          if (!cert || Object.keys(cert).length === 0) {
            socket.end();
            resolve({
              valid: false,
              issuer: "Unknown",
              expiresAt: null,
              daysRemaining: null,
              error: "No certificate returned"
            });
            return;
          }

          const expiresAt = cert.valid_to ? new Date(cert.valid_to) : null;
          const daysRemaining = expiresAt
            ? Math.floor((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : null;

          const validByDate = typeof daysRemaining === "number" ? daysRemaining >= 0 : false;
          const valid = socket.authorized || validByDate;

          resolve({
            valid,
            issuer: cert.issuer?.CN || cert.issuer?.O || "Unknown",
            expiresAt: expiresAt ? expiresAt.toISOString() : null,
            daysRemaining,
            error: socket.authorizationError || null
          });

          socket.end();
        }
      );

      socket.setTimeout(SSL_TIMEOUT_MS, () => {
        socket.destroy();
        resolve({
          valid: false,
          issuer: "Unknown",
          expiresAt: null,
          daysRemaining: null,
          error: "TLS handshake timed out"
        });
      });

      socket.on("error", (error) => {
        resolve({
          valid: false,
          issuer: "Unknown",
          expiresAt: null,
          daysRemaining: null,
          error: error.message || "TLS handshake failed"
        });
      });
    });
  } catch (error) {
    return {
      valid: false,
      issuer: "Unknown",
      expiresAt: null,
      daysRemaining: null,
      error: error.message || "Invalid target"
    };
  }
};

const headerWeights = {
  "content-security-policy": { key: "CSP", impact: -10, label: "Content-Security-Policy" },
  "strict-transport-security": { key: "HSTS", impact: -8, label: "Strict-Transport-Security" },
  "x-frame-options": { key: "XFO", impact: -6, label: "X-Frame-Options" },
  "referrer-policy": { key: "Referrer-Policy", impact: -3, label: "Referrer-Policy" },
  "x-content-type-options": { key: "XCTO", impact: -5, label: "X-Content-Type-Options" },
  "permissions-policy": { key: "Permissions-Policy", impact: 0, label: "Permissions-Policy" }
};

const requestHeaders = async (method, url) => {
  const { hostname, protocol, port, pathname, search } = normalizeTarget(url);
  const client = protocol === "http:" ? http : https;

  return await new Promise((resolve, reject) => {
    const request = client.request(
      {
        method,
        hostname,
        port,
        path: `${pathname}${search}`,
        rejectUnauthorized: false,
        servername: hostname,
        timeout: HEADER_TIMEOUT_MS
      },
      (response) => {
        const statusCode = response.statusCode ?? 0;
        const location = response.headers.location;

        if (statusCode >= 300 && statusCode < 400 && location) {
          response.resume();

          const nextUrl = new URL(location, url).toString();

          if (nextUrl !== url) {
            requestHeaders(method, nextUrl).then(resolve).catch(reject);
            return;
          }
        }

        if (method !== "HEAD") {
          response.resume();
        }

        resolve(response);
      }
    );

    request.on("timeout", () => {
      request.destroy(new Error("Header request timed out"));
    });

    request.on("error", reject);
    request.end();
  });
};

const extractHeaderReport = (responseHeaders) => {
  const present = [];
  const missing = [];

  const hasHeader = (headerName) => {
    if (!responseHeaders) return false;

    if (typeof responseHeaders.get === "function") {
      return Boolean(responseHeaders.get(headerName));
    }

    const value = responseHeaders[headerName] || responseHeaders[headerName.toLowerCase()];
    return Boolean(value);
  };

  Object.entries(headerWeights).forEach(([headerName, meta]) => {
    if (hasHeader(headerName)) {
      present.push(meta.key);
    } else if (meta.impact < 0) {
      missing.push(meta.key);
    }
  });

  const scoreDelta = present.reduce((sum, headerKey) => {
    if (headerKey === "CSP") return sum + 4;
    if (headerKey === "HSTS") return sum + 3;
    if (headerKey === "XFO") return sum + 2;
    if (headerKey === "XCTO") return sum + 2;
    if (headerKey === "Referrer-Policy") return sum + 1;
    return sum;
  }, 0) + missing.reduce((sum, headerKey) => {
    if (headerKey === "CSP") return sum - 10;
    if (headerKey === "HSTS") return sum - 8;
    if (headerKey === "XFO") return sum - 6;
    if (headerKey === "XCTO") return sum - 5;
    if (headerKey === "Referrer-Policy") return sum - 3;
    return sum;
  }, 0);

  const majorPresent = ["CSP", "HSTS", "XFO"].every((headerKey) => present.includes(headerKey));

  let grade = "Weak";
  if (missing.length === 0 && majorPresent) {
    grade = "Strong";
  } else if (missing.length <= 1) {
    grade = "Good";
  } else if (missing.length <= 3) {
    grade = "Weak";
  } else {
    grade = "Poor";
  }

  return {
    present,
    missing,
    scoreDelta: Math.max(-30, Math.min(10, scoreDelta)),
    grade
  };
};

export const checkSecurityHeaders = async (rawUrl) => {
  try {
    const { url } = normalizeTarget(rawUrl);

    let response = null;

    try {
      response = await requestHeaders("HEAD", url);
    } catch {
      response = null;
    }

    if (!response || (response.statusCode ?? response.status) === 405) {
      response = await requestHeaders("GET", url);
    }

    const report = extractHeaderReport(response.headers);

    return {
      ...report,
      statusCode: response.statusCode ?? response.status ?? null,
      checkedUrl: url
    };
  } catch (error) {
    return {
      present: [],
      missing: ["CSP", "HSTS", "XFO", "Referrer-Policy", "XCTO"],
      scoreDelta: -25,
      grade: "Poor",
      statusCode: null,
      checkedUrl: null,
      error: error.message || "Header check failed"
    };
  }
};

const getAgeLookupDomain = (hostname) => {
  if (!hostname || isIP(hostname)) {
    return null;
  }

  const parts = hostname.toLowerCase().split(".").filter(Boolean);

  if (parts.length < 2) {
    return null;
  }

  if (parts.length === 2) {
    return parts.join(".");
  }

  const commonSecondLevelTlds = new Set([
    "co.uk",
    "org.uk",
    "ac.uk",
    "gov.uk",
    "co.jp",
    "com.au",
    "net.au",
    "org.au",
    "co.nz",
    "com.br",
    "com.mx",
    "com.tr",
    "co.in",
    "firm.in",
    "net.in",
    "org.in",
    "gen.in"
  ]);

  const lastTwo = parts.slice(-2).join(".");
  if (commonSecondLevelTlds.has(lastTwo) && parts.length >= 3) {
    return parts.slice(-3).join(".");
  }

  if (parts[0] === "www" && parts.length >= 3) {
    return parts.slice(-2).join(".");
  }

  return lastTwo;
};

const lookupDomainAgeDays = async (hostname) => {
  const lookupDomain = getAgeLookupDomain(hostname);

  if (!lookupDomain || typeof fetch !== "function") {
    return null;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AGE_LOOKUP_TIMEOUT_MS);

    try {
      const response = await fetch(`https://rdap.org/domain/${encodeURIComponent(lookupDomain)}`, {
        signal: controller.signal,
        headers: {
          accept: "application/rdap+json, application/json"
        }
      });

      if (!response.ok) {
        return null;
      }

      const payload = await response.json();
      const events = Array.isArray(payload?.events) ? payload.events : [];
      const registrationEvent = events.find((event) => {
        const action = String(event?.eventAction || "").toLowerCase();
        return action === "registration" || action === "registered" || action === "creation";
      });

      const eventDate = registrationEvent?.eventDate ? new Date(registrationEvent.eventDate) : null;

      if (!eventDate || Number.isNaN(eventDate.getTime())) {
        return null;
      }

      return Math.max(0, Math.floor((Date.now() - eventDate.getTime()) / MS_PER_DAY));
    } finally {
      clearTimeout(timeoutId);
    }
  } catch {
    return null;
  }
};

const safeDnsLookup = async (lookupPromise) => {
  try {
    return await withTimeout(lookupPromise, DNS_TIMEOUT_MS);
  } catch {
    return [];
  }
};

const getDnsRecords = async (hostname) => {
  const lookupDomain = getAgeLookupDomain(hostname) || hostname;

  const [aRecords, aaaaRecords, cnameRecords, mxRecords, nsRecords, ageDays] = await Promise.all([
    safeDnsLookup(dns.resolve4(hostname)),
    safeDnsLookup(dns.resolve6(hostname)),
    safeDnsLookup(dns.resolveCname(hostname)),
    safeDnsLookup(dns.resolveMx(lookupDomain)),
    safeDnsLookup(dns.resolveNs(lookupDomain)),
    lookupDomainAgeDays(lookupDomain)
  ]);

  return {
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
      checkedDomain: lookupDomain.toLowerCase(),
      records: {
        a: records.aRecords,
        aaaa: records.aaaaRecords,
        cname: records.cnameRecords,
        mx: records.mxRecords,
        ns: records.nsRecords
      }
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
      error: error.message || "Domain signal check failed"
    };
  }
};
