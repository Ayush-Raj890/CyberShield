import { sendError, sendSuccess } from "../utils/response.js";
import { validationResult } from "express-validator";
import TrustScanJob from "../models/TrustScanJob.js";
import TrustScanReport from "../models/TrustScanReport.js";
import { runSslTlsCheck } from "../services/trustScanSignals.js";

const MOCK_SCAN_DURATION_MS = 4500;

const getNormalizedDomain = (rawUrl) => {
  try {
    const hasProtocol = /^https?:\/\//i.test(rawUrl);
    const parsed = new URL(hasProtocol ? rawUrl : `https://${rawUrl}`);
    return {
      url: parsed.toString(),
      normalizedDomain: parsed.hostname.toLowerCase()
    };
  } catch {
    return null;
  }
};

const createPlaceholderFactors = () => [
  {
    key: "dns",
    label: "DNS Resolve",
    impact: 0,
    status: "pending",
    detail: "DNS signal is queued for implementation."
  },
  {
    key: "headers",
    label: "Security Headers",
    impact: 0,
    status: "pending",
    detail: "Security headers signal is queued for implementation."
  },
  {
    key: "reputation",
    label: "Reputation",
    impact: 0,
    status: "pending",
    detail: "Reputation signal is queued for implementation."
  }
];

const getMockVerdict = (score) => {
  if (score >= 80) return "LOW_RISK";
  if (score >= 50) return "MEDIUM_RISK";
  return "HIGH_RISK";
};

const buildSslFactor = (ssl) => {
  if (ssl.valid) {
    const expiryText = typeof ssl.daysRemaining === "number"
      ? `${ssl.daysRemaining} days remaining`
      : "expiry unknown";

    return {
      key: "ssl",
      label: "SSL Certificate",
      impact: 15,
      status: "pass",
      detail: `Valid certificate from ${ssl.issuer}. Expires at ${ssl.expiresAt || "unknown"} (${expiryText}).`
    };
  }

  return {
    key: "ssl",
    label: "SSL Certificate",
    impact: -35,
    status: "fail",
    detail: `Certificate check failed: ${ssl.error || "invalid or expired certificate"}. Issuer: ${ssl.issuer}.`
  };
};

const buildMockReportPayload = async (job) => {
  const ssl = await runSslTlsCheck(job.url);
  const factors = [buildSslFactor(ssl), ...createPlaceholderFactors()];
  const score = Math.max(0, Math.min(100, 70 + factors.reduce((sum, item) => sum + item.impact, 0)));

  return {
    jobId: job._id,
    userId: job.userId,
    url: job.url,
    normalizedDomain: job.normalizedDomain,
    score,
    verdict: getMockVerdict(score),
    factors,
    summary: ssl.valid
      ? "Site uses a valid TLS certificate. Additional DNS, headers, and reputation factors will be layered next."
      : "TLS certificate validation failed, which is a strong risk signal. Additional factors will be layered next."
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
