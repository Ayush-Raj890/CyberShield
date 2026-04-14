import { sendError, sendSuccess } from "../utils/response.js";
import { validationResult } from "express-validator";
import TrustScanJob from "../models/TrustScanJob.js";
import TrustScanReport from "../models/TrustScanReport.js";
import {
  checkDomainSignals,
  checkReputationSignals,
  checkSecurityHeaders,
  runSslTlsCheck
} from "../services/trustScanSignals.js";
import { MOCK_SCAN_DURATION_MS } from "../services/trustscan/constants.js";
import { getTrustScanConfidence } from "../services/trustscan/confidenceService.js";
import {
  buildDomainFactor,
  buildHeadersFactor,
  buildReputationFactor,
  buildSslFactor,
  createPlaceholderFactors
} from "../services/trustscan/factorBuilders.js";
import { calculateScoreAndVerdict } from "../services/trustscan/scoringService.js";
import { buildTrustScanSummary } from "../services/trustscan/summaryService.js";

const getNormalizedDomain = (rawUrl) => {
  try {
    const hasProtocol = /^https?:\/\//i.test(rawUrl);
    const parsed = new URL(hasProtocol ? rawUrl : `https://${rawUrl}`);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    return {
      url: parsed.toString(),
      normalizedDomain: parsed.hostname.toLowerCase()
    };
  } catch {
    return null;
  }
};

const buildEvidenceEvent = ({ key, label, result, startedAtMs, endedAtMs }) => {
  let message = `${label} completed`;

  if (key === "ssl") {
    message = result.reason === "success" ? "TLS handshake passed" : "TLS handshake failed";
  } else if (key === "headers") {
    message = result.reason === "success" ? "Headers analyzed" : "Headers analysis failed";
  } else if (key === "dns") {
    message = result.reason === "success" ? "DNS resolved" : "DNS lookup failed";
  } else if (key === "reputation") {
    if (result.reason === "service_unavailable") {
      message = "Reputation source unavailable";
    } else if (result.reason === "api_error") {
      message = "Reputation lookup returned an API error";
    } else if (result.reason === "network_error") {
      message = "Reputation lookup encountered a network error";
    } else if (result.listed) {
      message = "Reputation flagged by public feeds";
    } else {
      message = "Reputation checked";
    }
  }

  return {
    key,
    label,
    message,
    reason: result.reason || "success",
    status: result.grade || result.status || "success",
    durationMs: endedAtMs - startedAtMs,
    occurredAt: new Date(endedAtMs).toISOString()
  };
};

const runTimedSignal = async (key, label, signalRunner, scanStartTimeMs) => {
  const startedAtMs = Date.now();
  const result = await signalRunner();
  const endedAtMs = Date.now();

  return {
    result,
    evidence: buildEvidenceEvent({
      key,
      label,
      result,
      startedAtMs: scanStartTimeMs + (startedAtMs - scanStartTimeMs),
      endedAtMs: scanStartTimeMs + (endedAtMs - scanStartTimeMs)
    })
  };
};

const buildMockReportPayload = async (job) => {
  const scanStartTime = Date.now();

  const [sslResult, headersResult, domainResult, reputationResult] = await Promise.all([
    runTimedSignal("ssl", "TLS handshake", () => runSslTlsCheck(job.url), scanStartTime),
    runTimedSignal("headers", "Headers analyzed", () => checkSecurityHeaders(job.url), scanStartTime),
    runTimedSignal("dns", "DNS resolved", () => checkDomainSignals(job.url), scanStartTime),
    runTimedSignal("reputation", "Reputation source", () => checkReputationSignals(job.url), scanStartTime)
  ]);

  const ssl = sslResult.result;
  const headers = headersResult.result;
  const domain = domainResult.result;
  const reputation = reputationResult.result;
  const scanEvidence = [sslResult.evidence, headersResult.evidence, domainResult.evidence, reputationResult.evidence]
    .sort((left, right) => new Date(left.occurredAt).getTime() - new Date(right.occurredAt).getTime());

  const scanEndTime = Date.now();
  const scanDurationMs = scanEndTime - scanStartTime;

  const factors = [
    buildSslFactor(ssl),
    buildHeadersFactor(headers),
    buildDomainFactor(domain),
    buildReputationFactor(reputation),
    ...createPlaceholderFactors()
  ];
  const { score, verdict } = calculateScoreAndVerdict(factors);

  return {
    jobId: job._id,
    userId: job.userId,
    url: job.url,
    normalizedDomain: job.normalizedDomain,
    score,
    verdict,
    confidence: getTrustScanConfidence({ ssl, headers, domain, reputation }),
    factors,
    summary: buildTrustScanSummary({ ssl, headers, domain, reputation }),
    scanDurationMs,
    scanEvidence,
    scanMetadata: {
      ssl: { reason: ssl?.reason || "success" },
      headers: { reason: headers?.reason || "success" },
      domain: { reason: domain?.reason || "success" },
      reputation: { reason: reputation?.reason || "success" }
    }
  };
};

const maybeAdvanceJobState = async (job) => {
  if (!job) return job;
  if (job.status === "completed" || job.status === "failed") return job;

  const startedAtMs = job.startedAt ? new Date(job.startedAt).getTime() : Date.now();
  const elapsedMs = Date.now() - startedAtMs;

  if (elapsedMs >= MOCK_SCAN_DURATION_MS) {
    job.status = "completed";
    job.completedAt = new Date();
    await job.save();
    return job;
  }

  if (job.status === "queued") {
    job.status = "running";
    job.startedAt = new Date();
    await job.save();
  }

  return job;
};

const ensureReportForCompletedJob = async (job) => {
  if (!job || job.status !== "completed") {
    return null;
  }

  const existing = await TrustScanReport.findOne({
    jobId: job._id,
    userId: job.userId
  });

  if (existing) {
    return existing;
  }

  const payload = await buildMockReportPayload(job);
  return TrustScanReport.create(payload);
};

export const createTrustScan = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, "Validation failed", errors.array());
    }

    const { url } = req.body;

    if (!url || typeof url !== "string" || !url.trim()) {
      return sendError(res, 400, "Valid URL is required");
    }

    const normalized = getNormalizedDomain(url.trim());
    if (!normalized) {
      return sendError(res, 400, "Invalid URL format");
    }

    const now = new Date();

    const job = await TrustScanJob.create({
      userId: req.user._id,
      url: normalized.url,
      normalizedDomain: normalized.normalizedDomain,
      status: "running",
      startedAt: now
    });

    return sendSuccess(res, {
      jobId: job._id,
      status: job.status,
      url: job.url,
      normalizedDomain: job.normalizedDomain,
      etaSeconds: Math.ceil(MOCK_SCAN_DURATION_MS / 1000)
    }, 201, "TrustScan job created");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getTrustScanById = async (req, res) => {
  try {
    const job = await TrustScanJob.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!job) {
      return sendError(res, 404, "TrustScan job not found");
    }

    const updatedJob = await maybeAdvanceJobState(job);
    const report = await ensureReportForCompletedJob(updatedJob);

    return sendSuccess(res, {
      job: updatedJob.toObject(),
      report: report ? report.toObject() : null
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getTrustScanHistory = async (req, res) => {
  try {
    const rawPage = Number.parseInt(req.query.page, 10);
    const rawLimit = Number.parseInt(req.query.limit, 10);

    const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 20) : 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      TrustScanReport.find({ userId: req.user._id })
        .select("jobId url normalizedDomain score verdict summary createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      TrustScanReport.countDocuments({ userId: req.user._id })
    ]);

    const totalPages = total > 0 ? Math.ceil(total / limit) : 0;

    return sendSuccess(res, {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page * limit < total
      }
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getPublicTrustScanReport = async (req, res) => {
  try {
    const report = await TrustScanReport.findById(req.params.id);

    if (!report) {
      return sendError(res, 404, "Report not found");
    }

    return sendSuccess(res, {
      report: report.toObject()
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
