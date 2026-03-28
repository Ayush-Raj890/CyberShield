import express from "express";
import { body, validationResult } from "express-validator";
import { registerUser, loginUser, verifyOTP, resendOTP } from "../controllers/authController.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().escape().notEmpty().withMessage("Name is required"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
  ],
  registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required")
  ],
  loginUser
);

router.post(
  "/verify-otp",
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
    body("otp")
      .trim()
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage("Valid 6-digit OTP required")
  ],
  verifyOTP
);

router.post(
  "/resend-otp",
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email required")
  ],
  resendOTP
);

export default router;
