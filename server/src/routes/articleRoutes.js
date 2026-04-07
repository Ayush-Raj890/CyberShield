import express from "express";
import { body } from "express-validator";
import {
  createArticle,
  getArticles,
  getMyArticles,
  getArticleById,
  getPendingArticles,
  updateArticleStatus,
  voteArticle
} from "../controllers/articleController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getArticles);
router.get("/user", protect, getMyArticles);
router.get("/admin/pending", protect, adminOnly, getPendingArticles);

// User-submitted articles (any authenticated user)
router.post(
  "/",
  protect,
  [
    body("title").trim().escape().notEmpty().withMessage("Title required"),
    body("content").trim().escape().notEmpty().withMessage("Content required"),
    body("category").isIn(["PHISHING", "SCAM", "PRIVACY", "GENERAL"]).withMessage("Invalid category"),
    body("tags").optional()
  ],
  createArticle
);

router.post("/:id/vote", protect, voteArticle);
router.get("/:id", getArticleById);

// Admin only - status updates
router.put("/:id/status", protect, adminOnly, updateArticleStatus);

export default router;
