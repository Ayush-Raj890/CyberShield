import { BASE_SCORE, VERDICT_BANDS } from "./constants.js";

const clampScore = (score) => Math.max(0, Math.min(100, score));

const getVerdictBand = (score) => VERDICT_BANDS.find((band) => score <= band.max)?.verdict || "CAUTION";

export const calculateScoreAndVerdict = (factors) => {
  const totalImpact = (factors || []).reduce((sum, item) => sum + (item?.impact || 0), 0);
  const score = clampScore(BASE_SCORE + totalImpact);

  return {
    score,
    verdict: getVerdictBand(score)
  };
};
