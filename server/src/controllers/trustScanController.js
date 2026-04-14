import { sendError, sendSuccess } from "../utils/response.js";
import { validationResult } from "express-validator";
import TrustScanJob from "../models/TrustScanJob.js";
import TrustScanReport from "../models/TrustScanReport.js";

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

const createMockFactors = () => [
  {
    key: "ssl",
    label: "SSL Certificate",
    impact: 10,
    status: "pass",
    detail: "Certificate is currently valid in mock check."
  },
  {
    key: "dns",
    label: "DNS Resolve",
    impact: 5,
    status: "pass",
    detail: "Domain resolves successfully in mock check."
  },
  {
    key: "headers",
    label: "Security Headers",
    impact: -8,
    status: "warn",
    detail: "CSP header appears missing in mock response."
  },
  {
    key: "reputation",
    label: "Reputation",
    impact: 12,
    status: "pass",
    detail: "No high-risk blacklist entries found in mock source."
  }
];

const getMockVerdict = (score) => {
  if (score >= 80) return "LOW_RISK";
  if (score >= 50) return "MEDIUM_RISK";
  return "HIGH_RISK";
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
      status: "completed",
      startedAt: now,
      completedAt: now
    });

    const factors = createMockFactors();
    const score = Math.max(0, Math.min(100, 70 + factors.reduce((sum, item) => sum + item.impact, 0)));
    const verdict = getMockVerdict(score);

    const report = await TrustScanReport.create({
      jobId: job._id,
      userId: req.user._id,
      url: normalized.url,
      normalizedDomain: normalized.normalizedDomain,
      score,
      verdict,
      factors,
      summary: "Mock summary: This URL appears moderately safe, but missing security headers reduce trust."
    });

    return sendSuccess(res, {
      jobId: job._id,
      status: job.status,
      reportId: report._id,
      url: report.url,
      normalizedDomain: report.normalizedDomain,
      score: report.score,
      verdict: report.verdict,
      summary: report.summary
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
    }).lean();

    if (!job) {
      return sendError(res, 404, "TrustScan job not found");
    }

    const report = await TrustScanReport.findOne({ jobId: job._id, userId: req.user._id }).lean();

    return sendSuccess(res, {
      job,
      report
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
