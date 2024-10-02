const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { computeScore, formatDaysOverview, formatAvgPower, formatAvgPrice } = require('../../helpers');

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

function getAvgPricePerDay() {
  return new Promise((resolve, reject) => {
    db.all('SELECT date(DateTime) AS Date, avg(Price) AS AvgPrice FROM PriceForecast\
      GROUP BY Date\
      ORDER BY Date DESC;', {}, (err, rows) => {
        if (err) {
          reject(`Failed to get average price per day: ${err.message}`);
        } else {
          resolve(formatAvgPrice(rows));
        }
      });
  });
}

function getAvgPowerPerDay() {
  return new Promise((resolve, reject) => {
    db.all('SELECT date(DateTime) AS Date, Type, avg(Power) AS AvgPower\
      FROM PowerForecast\
      GROUP BY Date, Type\
      ORDER BY Date DESC;', {}, (err, rows) => {
        if (err) {
          reject(`Failed to get average power per day: ${err.message}`);
        } else {
          resolve(formatAvgPower(rows));
        }
      });
  });
}

function getDaysOverview() {
  return Promise.all([getAvgPricePerDay(), getAvgPowerPerDay()])
    .then(([priceResults, powerResults]) => formatDaysOverview(priceResults, powerResults));
}

function getDayOverview(date) {
  return getDaysOverview()
    .then((result) => result.filter((dayOverview) => dayOverview.date === date)[0]);
}

function getDayPowerDetail(date) {
  return new Promise((resolve, reject) => {
    db.all('SELECT DateTime, Type, Power FROM PowerForecast\
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
    db.all('SELECT DateTime, Price FROM PriceForecast\
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
    db.get('SELECT count(DISTINCT date(DateTime)) AS Count FROM PriceForecast;', [], (err, rows) => {
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
  getDaysOverview,
  getDaysCount
}