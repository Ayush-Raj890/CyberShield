import express from "express";
import { body } from "express-validator";
import { protect } from "../middlewares/authMiddleware.js";
import { changePassword, getProfile, updateProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protect, getProfile);

router.put(
  "/profile",
  protect,
  [
    body("alias")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage("Alias must be 3 to 30 characters"),
    body("bio")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 300 })
      .withMessage("Bio cannot exceed 300 characters")
  ],
  updateProfile
);

router.put(
  "/change-password",
  protect,
  [
    body("currentPassword").notEmpty().withMessage("Current password required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters")
  ],
  changePassword
);

export default router;
