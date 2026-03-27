import Report from "../models/Report.js";
import { validationResult } from "express-validator";

// Create Report
export const createReport = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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

    const report = await Report.create({
      user: anonymousFlag ? null : req.user._id,
      title,
      description,
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

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Reports (User -> own, Admin -> all)
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Status (Admin only)
export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = status;
    report.history.push({ status });
    await report.save();

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
