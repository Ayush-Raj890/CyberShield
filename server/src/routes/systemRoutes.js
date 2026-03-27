import express from "express";
import { body } from "express-validator";
import { getClientErrors, logClientError } from "../controllers/systemController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/client-errors", protect, adminOnly, getClientErrors);

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
