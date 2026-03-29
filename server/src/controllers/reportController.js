import Report from "../models/Report.js";
import { validationResult } from "express-validator";
import Notification from "../models/Notification.js";
import { encrypt, decrypt } from "../utils/encryption.js";
import { sendError, sendSuccess } from "../utils/response.js";

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

    return sendSuccess(res, report, 201);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// Get Reports (User -> own, Admin -> all)
export const getReports = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const reports = await Report.find()
      .populate("user", "name alias")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const safeReports = reports.map((report) => {
      const item = report.toObject();
      if (item.isSensitive) {
        item.description = decrypt(item.description);
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
