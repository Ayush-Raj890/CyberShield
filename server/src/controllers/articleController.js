import Article from "../models/Article.js";
import { validationResult } from "express-validator";
import Notification from "../models/Notification.js";
import { sendError, sendSuccess } from "../utils/response.js";

// Create Article (Any authenticated user)
export const createArticle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, "Validation failed", errors.array());
    }

    const { title, content, category } = req.body;

    const article = await Article.create({
      title,
      content,
      category,
      createdBy: req.user._id,
      status: "PENDING"
    });

    await Notification.create({
      message: "New article submitted for review",
      type: "ARTICLE"
    });

    return sendSuccess(res, article, 201);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// Get All Approved Articles (Public)
export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({ status: "APPROVED" })
      .populate("createdBy", "name alias")
      .sort({ createdAt: -1 });

    return sendSuccess(res, articles);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// Get Single Article
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("createdBy", "name alias");

    if (!article || (article.status !== "APPROVED")) {
      return sendError(res, 404, "Article not found");
    }

    return sendSuccess(res, article);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// Get Pending Articles (Admin only)
export const getPendingArticles = async (req, res) => {
  try {
    const articles = await Article.find({ status: "PENDING" })
      .populate("createdBy", "name alias email")
      .sort({ createdAt: -1 });

    return sendSuccess(res, articles);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// Update Article Status (Admin only)
export const updateArticleStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return sendError(res, 400, "Invalid status");
    }

    const article = await Article.findById(req.params.id);

    if (!article) {
      return sendError(res, 404, "Article not found");
    }

    article.status = status;
    await article.save();

    return sendSuccess(res, article);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
