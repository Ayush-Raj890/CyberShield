import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { validationResult } from "express-validator";
import { sendError, sendSuccess } from "../utils/response.js";
import { sendEmail } from "../utils/sendEmail.js";
import { addXP } from "../utils/gamification.js";
import { addCoins } from "../utils/economy.js";

// Register
export const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, "Validation failed", errors.array());
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (!existingUser.isVerified) {
        await existingUser.deleteOne();
      } else {
        return sendError(res, 400, "User already exists");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationOTP: otp,
      otpExpires: otpExpiry,
      failedOtpAttempts: 0
    });

    await sendEmail(
      email,
      "Verify your account",
      `Your OTP is: ${otp}. It expires in 10 minutes.`
    );

    return sendSuccess(res, {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified
    }, 201);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, "Validation failed", errors.array());
    }

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    if (user.isVerified) {
      return sendError(res, 400, "Account already verified");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationOTP = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.failedOtpAttempts = 0;
    await user.save();

    await sendEmail(email, "Resend OTP", `Your OTP is: ${otp}. It expires in 10 minutes.`);

    return sendSuccess(res, { resent: true }, 200, "OTP resent");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, "Validation failed", errors.array());
    }

    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    const maxAttempts = 5;

    if (!user) {
      return sendError(res, 404, "User not found");
    }

    if (user.failedOtpAttempts >= maxAttempts) {
      return sendError(
        res,
        403,
        "Too many attempts. Please request a new OTP",
        [{ attemptsRemaining: 0 }]
      );
    }

    if (
      user.verificationOTP !== otp ||
      !user.otpExpires ||
      user.otpExpires < Date.now()
    ) {
      user.failedOtpAttempts += 1;
      await user.save();

      const attemptsRemaining = Math.max(0, maxAttempts - user.failedOtpAttempts);

      if (user.failedOtpAttempts >= maxAttempts) {
        return sendError(
          res,
          403,
          "Too many attempts. Please request a new OTP",
          [{ attemptsRemaining }]
        );
      }

      return sendError(res, 400, "Invalid or expired OTP", [{ attemptsRemaining }]);
    }

    user.isVerified = true;
    user.verificationOTP = null;
    user.otpExpires = null;
    user.failedOtpAttempts = 0;
    await user.save();

    return sendSuccess(res, { verified: true, attemptsRemaining: maxAttempts }, 200, "Account verified");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendError(res, 400, "Validation failed", errors.array());
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) {
        return sendError(res, 403, "Please verify your email first");
      }

      if (user.isSuspended) {
        return sendError(res, 403, "Account suspended");
      }

      const now = new Date();
      const today = now.toDateString();
      const lastDate = user.lastActive ? new Date(user.lastActive) : null;
      const lastDay = lastDate ? lastDate.toDateString() : null;
      user.streak = Number(user.streak || 0);

      if (today !== lastDay) {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastDay === yesterday.toDateString()) {
          user.streak += 1;
        } else {
          user.streak = 1;
        }

        user.lastActive = now;
        await user.save();
        await addXP(user._id, "DAILY_LOGIN");
        await addCoins(user._id, "DAILY_LOGIN");
      }

      if (!user.lastActive) {
        user.lastActive = now;
        await user.save();
      }

      const refreshedUser = await User.findById(user._id);

      return sendSuccess(res, {
        _id: refreshedUser._id,
        name: refreshedUser.name,
        email: refreshedUser.email,
        role: refreshedUser.role,
        xp: refreshedUser.xp,
        level: refreshedUser.level,
        streak: refreshedUser.streak,
        coins: refreshedUser.coins,
        badges: refreshedUser.badges,
        token: generateToken(refreshedUser._id)
      });
    } else {
      return sendError(res, 401, "Invalid credentials");
    }
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
