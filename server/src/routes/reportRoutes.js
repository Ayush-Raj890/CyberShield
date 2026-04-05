import express from "express";
import rateLimit from "express-rate-limit";
import { body } from "express-validator";
import {
  createReport,
  getReports,
  getMyReports,
  updateReportStatus
} from "../controllers/reportController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/roleMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

const publicReportListLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many report list requests, please try again shortly"
  }
});

router.post(
  "/",
  protect,
  upload.single("evidence"),
  [
    body("title").trim().escape().notEmpty().withMessage("Title required"),
    body("description").trim().escape().notEmpty().withMessage("Description required"),
    body("category").isIn(["PHISHING", "SCAM", "HARASSMENT", "OTHER"]).withMessage("Invalid category"),
    body("severity").optional().isIn(["LOW", "MEDIUM", "HIGH"]).withMessage("Invalid severity"),
    body("contactEmail").optional().isEmail().withMessage("Invalid email"),
    body("isAnonymous").optional().isBoolean().toBoolean().withMessage("Invalid anonymous flag"),
    body("isSensitive").optional().isBoolean().toBoolean().withMessage("Invalid sensitive flag")
  ],
  createReport
);
router.get("/", publicReportListLimiter, getReports);
router.get("/me", protect, getMyReports);
router.put("/:id", protect, adminOnly, updateReportStatus);

export default router;
