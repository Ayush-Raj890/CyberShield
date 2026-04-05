import Report from "../models/Report.js";
import { validationResult } from "express-validator";
import Notification from "../models/Notification.js";
import { encrypt, decrypt } from "../utils/encryption.js";
import { addXP } from "../utils/gamification.js";
import { addCoins } from "../utils/economy.js";
import { sendError, sendSuccess } from "../utils/response.js";

const PUBLIC_PAGE_LIMIT_MAX = 20;
const PRIVATE_PAGE_LIMIT_MAX = 50;

const getPagination = (query, maxLimit) => {
  const rawPage = Number(query.page);
  const rawLimit = Number(query.limit);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const limit = Number.isFinite(rawLimit) && rawLimit > 0
    ? Math.min(Math.floor(rawLimit), maxLimit)
    : Math.min(10, maxLimit);

  return { page, limit };
};

const serializePublicReport = (report) => {
  const safeDescription = report.isSensitive
    ? "Sensitive report details are hidden"
    : report.description;

  return {
    _id: report._id,
    title: report.title,
    description: safeDescription,
    category: report.category,
    severity: report.severity,
    status: report.status,
    isAnonymous: Boolean(report.isAnonymous),
    isSensitive: Boolean(report.isSensitive),
    createdAt: report.createdAt,
    updatedAt: report.updatedAt
  };
};

// Create Report
export const createReport = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, "Validation failed", errors.array());
    }

    const {
      title,
      description,
      category,
      severity,
      contactEmail,
      isAnonymous,
      isSensitive
    } = req.body;
    const evidencePath = req.file ? `/uploads/${req.file.filename}` : null;
    const anonymousFlag = isAnonymous === true || isAnonymous === "true";
    const sensitiveFlag = isSensitive === true || isSensitive === "true";
    const safeDescription = sensitiveFlag ? encrypt(description) : description;

    const report = await Report.create({
      user: anonymousFlag ? null : req.user._id,
      title,
      description: safeDescription,
      category,
      severity: severity || "LOW",
      contactEmail,
      evidence: evidencePath,
      isAnonymous: anonymousFlag,
      isSensitive: sensitiveFlag,
      history: [{ status: "PENDING" }]
    });

    if (report.isAnonymous) {
      report.user = null;
    }

    await Notification.create({
      message: "New report submitted",
      type: "REPORT"
    });

    await addXP(req.user._id, "REPORT_CREATED");
    await addCoins(req.user._id, "REPORT_CREATED");

    return sendSuccess(res, report, 201);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// Get public report feed (safe, non-sensitive projection)
export const getReports = async (req, res) => {
  try {
    const { page, limit } = getPagination(req.query, PUBLIC_PAGE_LIMIT_MAX);

    const reports = await Report.find()
      .select("title description category severity status isAnonymous isSensitive createdAt updatedAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const safeReports = reports.map((report) => serializePublicReport(report));

    return sendSuccess(res, safeReports);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// Get current user's own reports (detailed view)
export const getMyReports = async (req, res) => {
  try {
    const { page, limit } = getPagination(req.query, PRIVATE_PAGE_LIMIT_MAX);

    const reports = await Report.find({ user: req.user._id })
      .select("title description category severity status contactEmail evidence isAnonymous isSensitive history createdAt updatedAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const safeReports = reports.map((report) => {
      const item = report.toObject();
      if (item.isSensitive) {
        const { data, usedLegacy } = decrypt(item.description, {
          source: "reportController.getMyReports",
          recordId: String(report._id)
        });

        item.description = data;

        if (usedLegacy) {
          const reEncrypted = encrypt(data);

          if (report.description !== reEncrypted) {
            report.description = reEncrypted;
            report.save().catch((error) => {
              console.error(`[ENCRYPTION] Lazy migration failed for report=${report._id}:`, error.message);
            });
          }
        }
      }
      return item;
    });

    return sendSuccess(res, safeReports);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// Update Status (Admin only)
export const updateReportStatus = async (req, res) => {
  try {
    const { status: newStatus } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      return sendError(res, 404, "Report not found");
    }

    report.status = newStatus;
    report.history.push({
      status: newStatus,
      date: new Date()
    });
    await report.save();

    await Notification.create({
      message: `Report marked as ${newStatus}`,
      type: "REPORT"
    });

    return sendSuccess(res, report);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
