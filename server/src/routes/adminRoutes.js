import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllReportsAdmin,
  deleteArticle,
  promoteToAdmin,
  suspendUser,
  unsuspendUser,
  removeAdmin
} from "../controllers/adminController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { adminOnly, superAdminOnly } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// Dashboard
router.get("/stats", protect, adminOnly, getDashboardStats);

// Users
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.put("/promote/:id", protect, adminOnly, promoteToAdmin);
router.put("/suspend/:id", protect, adminOnly, suspendUser);
router.put("/users/:id/unsuspend", protect, adminOnly, unsuspendUser);
router.put("/demote/:id", protect, superAdminOnly, removeAdmin);

// Reports
router.get("/reports", protect, adminOnly, getAllReportsAdmin);

// Articles
router.delete("/articles/:id", protect, adminOnly, deleteArticle);

export default router;
