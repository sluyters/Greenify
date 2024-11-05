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

// Exagerated impact of coal for testing purpose
// const IMPACT = {
//   'CP': 1.0, // Coal pulverized
//   'LF': 0.9, // Liquid fuel
//   'NG': 0.90, // Natural gas
//   'NU': 0.006, // Nuclear
//   'SO': 0.053, // Solar
//   'WA': 0.024, // Water
//   'WI': 0.011, // Wind
//   'OTHER': 0.330, // Biomass,...
// }

const MIN_IMPACT = Math.min(...Object.values(IMPACT));
const MAX_IMPACT = Math.max(...Object.values(IMPACT));

const SCORE_FN_POINT = 1 / (1 - MIN_IMPACT / MAX_IMPACT);
const SCORE_FN_SLOPE = - SCORE_FN_POINT / MAX_IMPACT;


function computeScore(powerGeneration) {
  let x = 0;
  let totalPower = 0;
  for (let [type, power] of Object.entries(powerGeneration)) {
    if (IMPACT[type] > 0.4) {
      x += Math.pow(IMPACT[type], 1.0 / 8.0) * power;
    } else if (IMPACT[type] > 0.2) {
      x += Math.pow(IMPACT[type], 1.0 / 3.0) * power;
    } else {
      x += Math.pow(IMPACT[type], 2) * power;
    }
    totalPower += power;
  }
  x /= totalPower;
  console.log(x, totalPower, MIN_IMPACT, MAX_IMPACT, SCORE_FN_POINT, SCORE_FN_SLOPE)
  return SCORE_FN_SLOPE * x + SCORE_FN_POINT;
}

function formatDaysOverview(priceResults, powerResults) {
  let result = [];
  for (let i = 0; i < priceResults.length; i++) {
    let dateResult = {
      date: priceResults[i].date, // TODO check if date is the same
      avgPrice: priceResults[i].avgPrice,
      avgPower: powerResults[i].avgPower,
      score: computeScore(powerResults[i].avgPower),
      totalPower: Object.values(powerResults[i].avgPower).reduce((a, b) => a + b)
    };
    result.push(dateResult)
  } 
  return result;
}

function formatAvgPrice(rows) {
  let result = rows.map((row) => {
    return {
      date: row.Date,
      avgPrice: row.AvgPrice
    }
  });
  return result;
}

function formatAvgPower(rows) {
  let result = [];
  let currentDate = null;
  for (let row of rows) { 
    if (!currentDate || currentDate.date !== row.Date) {
      currentDate = {
        date: row.Date,
        avgPower: {}
      };
      result.push(currentDate);
    }
    currentDate.avgPower[row.Type] = row.AvgPower;
  }
  return result;
}

module.exports = {
  formatDaysOverview,
  formatAvgPrice,
  formatAvgPower,
  computeScore
};