import express from "express";
import { body } from "express-validator";
import {
  createReport,
  getReports,
  updateReportStatus
} from "../controllers/reportController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/roleMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

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
router.get("/", getReports);
router.put("/:id", protect, adminOnly, updateReportStatus);

export default router;
