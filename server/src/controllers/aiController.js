import { analyzeText } from "../services/aiService.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { addXP } from "../utils/gamification.js";

export const detectScam = async (req, res) => {
  try {
    const { text } = req.body;

    const result = await analyzeText(text);

    if (req.user?._id) {
      await addXP(req.user._id, "AI_USED");
    }

    return sendSuccess(res, result);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};
