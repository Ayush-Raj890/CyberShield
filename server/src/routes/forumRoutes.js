import express from "express";
import { createPost, addReply, getAllPosts, getMyPosts } from "../controllers/forumController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPost);
router.post("/:id/reply", protect, addReply);
router.get("/", getAllPosts);
router.get("/user", protect, getMyPosts);

export default router;
