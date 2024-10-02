const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { computeScore, formatAvgPrice, formatAvgPower, formatDaysOverview } = require('../../helpers');

const DB_PATH = path.resolve(__dirname, '../../greenify.db');

console.log(DB_PATH)

// Connect to the database (create if it does not exist)
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.')
  }
});

/**
 * 
 * @param {string} fromDate ISO-format date at which to start extraction, included
 * @param {string} toDate ISO-format date at which at which to stop extraction, included
 * @returns 
 */
function getAvgPricePerDayByDate(fromDate, toDate) {
  return new Promise((resolve, reject) => {
    db.all('SELECT date(DateTime) AS Date, avg(Price) AS AvgPrice FROM PriceActual\
      WHERE Date >= date($fromDate) AND Date <= date($toDate)\
      GROUP BY Date\
      ORDER BY Date DESC;', {
        $fromDate: fromDate,
        $toDate: toDate
      }, (err, rows) => {
        if (err) {
          reject(`Failed to get average price per day: ${err.message}`);
        } else {
          resolve(formatAvgPrice(rows));
        }
      });
  });
}

function getAvgPricePerDayByPage(page, limit) {
  return new Promise((resolve, reject) => {
    db.all('SELECT date(DateTime) AS Date, avg(Price) AS AvgPrice FROM PriceActual\
      GROUP BY Date\
      ORDER BY Date DESC\
      LIMIT $limit OFFSET $offset;', {
        $limit: limit,
        $offset: page * limit
      }, (err, rows) => {
        if (err) {
          console.log(limit, page)
          reject(`Failed to get average price per day: ${err.message}`);
        } else {
          resolve(formatAvgPrice(rows));
        }
      });
  });
}

function getAvgPowerPerDayByDate(fromDate, toDate) {
  return new Promise((resolve, reject) => {
    db.all('SELECT date(DateTime) AS Date, Type, avg(Power) AS AvgPower\
      FROM PowerActual\
      WHERE Date >= date($fromDate) AND Date <= date($toDate)\
      GROUP BY Date, Type\
      ORDER BY Date DESC;', {
        $fromDate: fromDate,
        $toDate: toDate
      }, (err, rows) => {
        if (err) {
          reject(`Failed to get average power per day: ${err.message}`);
        } else {
          resolve(formatAvgPower(rows));
        }
      });
  });
}

function getAvgPowerPerDayByPage(page, limit) {
  return new Promise((resolve, reject) => {
    db.all('SELECT Selection.Date, PowerActual.Type, avg(PowerActual.Power) AS AvgPower\
      FROM PowerActual\
      JOIN (SELECT DISTINCT date(DateTime) AS Date FROM PowerActual ORDER BY Date DESC LIMIT $limit OFFSET $offset) AS Selection\
      ON date(PowerActual.DateTime) = Selection.Date\
      GROUP BY Selection.Date, PowerActual.Type\
      ORDER BY Selection.Date DESC;', {
        $limit: limit,
        $offset: page * limit
      }, (err, rows) => {
        if (err) {
          reject(`Failed to get average power per day: ${err.message}`);
        } else {
          resolve(formatAvgPower(rows));
        }
      });
  });
}

function getDaysOverviewByDate(fromDate, toDate) {
  return Promise.all([getAvgPricePerDayByDate(fromDate, toDate), getAvgPowerPerDayByDate(fromDate, toDate)])
    .then(([priceResults, powerResults]) => formatDaysOverview(priceResults, powerResults));
}

function getDaysOverviewByPage(page, limit) {
  return Promise.all([getAvgPricePerDayByPage(page, limit), getAvgPowerPerDayByPage(page, limit)])
    .then(([priceResults, powerResults]) => formatDaysOverview(priceResults, powerResults));
}

function getDayOverview(date) {
  return getDaysOverviewByDate(date, date)
    .then((result) => result[0]);
}

function getDayPowerDetail(date) {
  return new Promise((resolve, reject) => {
    db.all('SELECT DateTime, Type, Power FROM PowerActual\
      WHERE date(DateTime) = date($date)\
      ORDER BY DateTime DESC;', {
        $date: date
      }, (err, rows) => {
        if (err) {
          reject(`Failed to get power details: ${err.message}`);
        } else {
          let result = [];
          let currentDateTime = null;
          for (let row of rows) {
            if (!currentDateTime || currentDateTime.dateTime !== row.DateTime) {
              if (currentDateTime) {
                currentDateTime.score = computeScore(currentDateTime.power);
              }
              currentDateTime = {
                dateTime: row.DateTime,
                score: 0,
                totalPower: 0,
                power: {}
              };
              result.push(currentDateTime);
            }
            currentDateTime.power[row.Type] = row.Power;
            currentDateTime.totalPower += row.Power;
          }
          if (currentDateTime) {
            currentDateTime.score = computeScore(currentDateTime.power);
          }
          resolve(result);
        }
      });
  });
}

function getDayPriceDetail(date) {
  return new Promise((resolve, reject) => {
    db.all('SELECT DateTime, Price FROM PriceActual\
      WHERE date(DateTime) = date($date)\
      ORDER BY DateTime DESC;', {
        $date: date
      }, (err, rows) => {
        if (err) {
          reject(`Failed to get price details: ${err.message}`);
        } else {
          let result = rows.map((row) => {
            return {
              dateTime: row.DateTime,
              price: row.Price
            }
          });
          resolve(result);
        }
      });
  });
}

function getDayDetail(date) {
  return Promise.all([getDayOverview(date), getDayPriceDetail(date), getDayPowerDetail(date)])
    .then(([dayOverview, dayPriceDetail, dayPowerDetail]) => {
      let result = dayOverview;
      result.price = dayPriceDetail;
      result.power = dayPowerDetail;
      return result;
    });
}

function getDaysCount() {
  return new Promise((resolve, reject) => {
    db.get('SELECT count(DISTINCT date(DateTime)) AS Count FROM PriceActual;', [], (err, rows) => {
      if (err) {
        reject(`Failed to get item: ${err.message}`);
      } else {
        resolve(rows.Count);
      }
    })
  });
}

module.exports = {
  getDayDetail,
  getDaysOverviewByDate,
  getDaysOverviewByPage,
  getDaysCount
}
