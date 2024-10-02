const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { computeScore } = require('../../helpers');

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

function avgPriceHelper(rows) {
  let result = rows.map((row) => {
    return {
      date: row.Date,
      avgPrice: row.AvgPrice
    }
  });
  return result;
}

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
          resolve(avgPriceHelper(rows));
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
          resolve(avgPriceHelper(rows));
        }
      });
  });
}

function avgPowerHelper(rows) {
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
          resolve(avgPowerHelper(rows));
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
          resolve(avgPowerHelper(rows));
        }
      });
  });
}


function overviewHelper(priceResults, powerResults) {
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

function getDaysOverviewByDate(fromDate, toDate) {
  return Promise.all([getAvgPricePerDayByDate(fromDate, toDate), getAvgPowerPerDayByDate(fromDate, toDate)])
    .then(([priceResults, powerResults]) => overviewHelper(priceResults, powerResults));
}

function getDaysOverviewByPage(page, limit) {
  return Promise.all([getAvgPricePerDayByPage(page, limit), getAvgPowerPerDayByPage(page, limit)])
    .then(([priceResults, powerResults]) => overviewHelper(priceResults, powerResults));
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




// function addEnergyRecord(actual) {
//   db.get('INSERT INTO EnergyActual (Date, Price) VALUES ($date, $price) RETURNING ID', {
//     $date: actual.date.toISOString(),
//     $price: actual.price.toString()
//   }, (err, row) => {
//     if (err) {
//       console.error(err.message);
//     } else {
//       let actualId = row['ID'];
//       for (let fuel of actual.fuel) {
//         console.log(fuel.power)
//         db.run('INSERT INTO FuelActual VALUES ($actualId, $type, $power)', {
//           $actualId: actualId,
//           $type: fuel.type,
//           $power: fuel.power.toString()
//         }, (err) => {
//           if (err) {
//             console.error(err.message);
//           }
//         });
//       }
//     }
//   });
// }

// function removeEnergyRecord(id) {
//   // return item;
// }

// function updateEnergyRecord(id, item) {
//   // db.run('UPDATE production ')
// }

// function getEnergyRecord(id) {
//   return getItems(id, id+1).then((rows) => rows[0]);
// }

// function getEnergyRecords(startDate, endDate) {
//   return new Promise((resolve, reject) => {
//     db.all('SELECT FuelActual.ID', {
//       $startDate: startDate,
//       $endDate: endDate
//     }, (err, rows) => {

//     });
//   });



//   return new Promise((resolve, reject) => {
//     db.all(`SELECT Production.ProductionID, Production.Date, Production.Score, Type, Power FROM Production JOIN Detail ON Production.ProductionID = Detail.ProductionID WHERE Production.ProductionID >= ${startId} AND Production.ProductionID < ${endId} ORDER BY Production.ProductionID`, [], (err, rows) => {
//       if (err) {
//         reject(`Failed to get items: ${err.message}`);
//       } else if (rows.length === 0) { 
//         reject(`Failed to get items: Empty result.`)
//       } else {
//         let items = []
//         let currentID = -1;
//         let currentItem = null;
//         for (let row of rows) {
//           if (row.ProductionID !== currentID) { // Next item
//             currentID = row.ProductionID;
//             currentItem = {
//               id: currentID,
//               date: new Date(row.Date),
//               score: row.Score,
//               totalPower: 0,
//               productionDetails: [],
//             }
//             items.push(currentItem);
//           } 
//           // Update current item
//           currentItem.totalPower += row.Power;
//           currentItem.productionDetails.push({
//             type: row.Type,
//             power: row.Power
//           });
//         }
//         resolve(items);
//       }
//     });
//   });
// }

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
  // addEnergyRecord,
  // removeEnergyRecord,
  // updateEnergyRecord,
  // getEnergyRecord,
  // getEnergyRecords,
  getDayDetail,
  getDaysOverviewByDate,
  getDaysOverviewByPage,
  getDaysCount
}
