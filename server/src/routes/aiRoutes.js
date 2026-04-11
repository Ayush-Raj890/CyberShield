import express from "express";
import rateLimit from "express-rate-limit";
import { body } from "express-validator";
import { detectScam } from "../controllers/aiController.js";
import { optionalProtect } from "../middlewares/authMiddleware.js";

const router = express.Router();

const parsePositiveNumber = (rawValue, fallback) => {
	const parsed = Number(rawValue);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const aiPredictTextMaxChars = parsePositiveNumber(process.env.AI_PREDICT_TEXT_MAX_CHARS, 10000);
const aiPredictWindowMs = parsePositiveNumber(process.env.AI_PREDICT_WINDOW_MS, 15 * 60 * 1000);
const aiPredictMax = parsePositiveNumber(process.env.AI_PREDICT_MAX, 50);

const aiPredictLimiter = rateLimit({
	windowMs: aiPredictWindowMs,
	max: aiPredictMax,
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		success: false,
		message: "Too many AI prediction attempts. Please try again later."
	}
});

router.post(
	"/predict",
	aiPredictLimiter,
	optionalProtect,
	[
		body("text")
			.isString()
			.withMessage("Text is required")
			.trim()
			.notEmpty()
			.withMessage("Text is required")
			.isLength({ max: aiPredictTextMaxChars })
			.withMessage(`Text must be at most ${aiPredictTextMaxChars} characters`)
	],
	detectScam
);

export default router;
