import User from "../models/User.js";
import Report from "../models/Report.js";
import Article from "../models/Article.js";
import { decrypt } from "../utils/encryption.js";
import { sendError, sendSuccess } from "../utils/response.js";

// Dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReports = await Report.countDocuments();
    const totalArticles = await Article.countDocuments();

    const pendingReports = await Report.countDocuments({
      status: "PENDING"
    });

    return sendSuccess(res, {
      totalUsers,
      totalReports,
      totalArticles,
      pendingReports
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return sendSuccess(res, users);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    await user.deleteOne();

    return sendSuccess(res, { deletedUserId: req.params.id }, 200, "User removed");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// Get all reports (admin view with user details)
export const getAllReportsAdmin = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const reports = await Report.find()
      .populate("user", "name alias email")
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

// Delete article
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return sendError(res, 404, "Article not found");
    }

    await article.deleteOne();

    return sendSuccess(res, { deletedArticleId: req.params.id }, 200, "Article deleted");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// Promote user to admin (Admin or Super Admin)
export const promoteToAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    if (user.role === "SUPER_ADMIN") {
      return sendError(res, 400, "Cannot modify Super Admin role");
    }

    user.role = "ADMIN";
    await user.save();

    return sendSuccess(res, { userId: user._id, role: user.role }, 200, "User promoted to admin");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// Suspend user (Admin or Super Admin)
export const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    if (user.role === "SUPER_ADMIN") {
      return sendError(res, 400, "Cannot suspend Super Admin");
    }

    user.isSuspended = true;
    await user.save();

    return sendSuccess(res, { userId: user._id, isSuspended: user.isSuspended }, 200, "User suspended");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// Remove admin role (Super Admin only)
export const removeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    if (user.role !== "ADMIN") {
      return sendError(res, 400, "Not an admin");
    }

    user.role = "USER";
    await user.save();

    return sendSuccess(res, { userId: user._id, role: user.role }, 200, "Admin removed");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
