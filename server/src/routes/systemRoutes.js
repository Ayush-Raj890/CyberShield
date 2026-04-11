import express from "express";
import { body } from "express-validator";
import { exportClientErrorsCsv, getClientErrors, logClientError } from "../controllers/systemController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/roleMiddleware.js";

const router = express.Router();
const startedAt = Date.now();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

router.get("/version", (req, res) => {
  res.status(200).json({
    version: process.env.APP_VERSION || process.env.npm_package_version || "unknown"
  });
});

router.get("/uptime", (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startedAt) / 1000);

  res.status(200).json({
    uptimeSeconds,
    startedAt: new Date(startedAt).toISOString()
  });
});

router.get("/client-errors", protect, adminOnly, getClientErrors);
router.get("/client-errors/export", protect, adminOnly, exportClientErrorsCsv);

router.post(
  "/client-errors",
  [
    body("message").trim().isLength({ min: 1, max: 3000 }).withMessage("Message is required"),
    body("source").optional().isIn(["UI", "API"]).withMessage("Invalid source"),
    body("statusCode").optional().isInt({ min: 100, max: 599 }).withMessage("Invalid status code")
  ],
  logClientError
);

export default router;
