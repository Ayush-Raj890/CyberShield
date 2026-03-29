import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import Report from "../models/Report.js";
import Article from "../models/Article.js";
import ForumPost from "../models/ForumPost.js";
import { sendError, sendSuccess } from "../utils/response.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    const [reports, articles, posts] = await Promise.all([
      Report.countDocuments({ user: req.user._id }),
      Article.countDocuments({ createdBy: req.user._id }),
      ForumPost.countDocuments({ user: req.user._id })
    ]);

    return sendSuccess(res, {
      user,
      stats: {
        reports,
        articles,
        posts
      }
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, "Validation failed", errors.array());
    }

    const { alias, bio } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    if (typeof alias === "string") {
      const nextAlias = alias.trim();

      if (nextAlias) {
        const aliasOwner = await User.findOne({
          alias: nextAlias,
          _id: { $ne: user._id }
        });

        if (aliasOwner) {
          return sendError(res, 400, "Alias already in use");
        }

        user.alias = nextAlias;
      }
    }

    if (typeof bio === "string") {
      user.bio = bio.trim();
    }

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    return sendSuccess(res, { user: safeUser }, 200, "Profile updated");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, "Validation failed", errors.array());
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return sendError(res, 400, "Incorrect current password");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return sendSuccess(res, { changed: true }, 200, "Password updated");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
