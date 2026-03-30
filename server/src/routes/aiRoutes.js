import express from "express";
import { detectScam } from "../controllers/aiController.js";
import { optionalProtect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/predict", optionalProtect, detectScam);

export default router;
