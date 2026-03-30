import ForumPost from "../models/ForumPost.js";
import { addXP } from "../utils/gamification.js";
import { spendCoins } from "../utils/economy.js";
import { sendError, sendSuccess } from "../utils/response.js";

export const createPost = async (req, res) => {
  try {
    try {
      await spendCoins(req.user._id, "FORUM_POST");
    } catch (economyError) {
      return sendError(res, 400, economyError.message);
    }

    const post = await ForumPost.create({
      user: req.user._id,
      title: req.body.title,
      content: req.body.content
    });

    await addXP(req.user._id, "FORUM_POST");

    return sendSuccess(res, post, 201);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const addReply = async (req, res) => {
  try {
    try {
      await spendCoins(req.user._id, "COMMENT");
    } catch (economyError) {
      return sendError(res, 400, economyError.message);
    }

    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return sendError(res, 404, "Post not found");
    }

    post.replies.push({
      user: req.user._id,
      text: req.body.text
    });

    await post.save();
    return sendSuccess(res, post);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find()
      .populate("user", "name alias")
      .populate("replies.user", "name alias")
      .sort({ createdAt: -1 });

    return sendSuccess(res, posts);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
