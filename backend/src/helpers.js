// From https://ourworldindata.org/safest-sources-of-energy#:~:text=Again%2C%20coal%20is%20the%20dirtiest,a%20lesser%20extent%20than%20coal.
const IMPACT = {
  'CP': 0.970, // Coal pulverized
  'LF': 0.720, // Liquid fuel
  'NG': 0.440, // Natural gas
  'NU': 0.006, // Nuclear
  'SO': 0.053, // Solar
  'WA': 0.024, // Water
  'WI': 0.011, // Wind
  'OTHER': 0.230, // Biomass,...
}

const MIN_IMPACT = Math.min(...Object.values(IMPACT));
const MAX_IMPACT = Math.max(...Object.values(IMPACT));

const SCORE_FN_POINT = 1 / (1 - MIN_IMPACT / MAX_IMPACT);
const SCORE_FN_SLOPE = - SCORE_FN_POINT / MAX_IMPACT;


function computeScore(powerGeneration) {
  let x = 0;
  let totalPower = 0;
  for (let [type, power] of Object.entries(powerGeneration)) {
    x += IMPACT[type] * power;
    totalPower += power;
  }
  x /= totalPower;
  console.log(x, totalPower, MIN_IMPACT, MAX_IMPACT, SCORE_FN_POINT, SCORE_FN_SLOPE)
  return SCORE_FN_SLOPE * x + SCORE_FN_POINT;
}

module.exports = {
  computeScore
};