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

function getAvgPricePerDay() {
  return new Promise((resolve, reject) => {
    db.all('SELECT date(DateTime) AS Date, avg(Price) AS AvgPrice FROM PriceForecast\
      GROUP BY Date\
      ORDER BY Date DESC;', {}, (err, rows) => {
        if (err) {
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

function getAvgPowerPerDay() {
  return new Promise((resolve, reject) => {
    db.all('SELECT date(DateTime) AS Date, Type, avg(Power) AS AvgPower\
      FROM PowerForecast\
      GROUP BY Date, Type\
      ORDER BY Date DESC;', {}, (err, rows) => {
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

function getDaysOverview() {
  return Promise.all([getAvgPricePerDay(), getAvgPowerPerDay()])
    .then(([priceResults, powerResults]) => overviewHelper(priceResults, powerResults));
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



// const fs = require('fs');
// const path = require('path');
// const sqlite3 = require('sqlite3').verbose();
// const ENERGY_DATA = require('../../data');

// const DB_PATH = path.resolve(__dirname, './forecast.db');

// const fillDB = !fs.existsSync(DB_PATH);

// const db = new sqlite3.Database(DB_PATH, (err) => {
//   if (err) {
//     console.error(err.message);
//   } else {
//     console.log('Connected to the \'forecast\' database.')
//   }
// });



// if (fillDB) {
//   db.serialize();
//   // Create tables
//   db.run('CREATE TABLE IF NOT EXISTS Production (\
//     ProductionID INTEGER PRIMARY KEY,\
//     Date TEXT NOT NULL,\
//     Score FLOAT NOT NULL)');
//   db.run('CREATE TABLE IF NOT EXISTS Detail (\
//     ProductionID INTEGER NOT NULL,\
//     Type TEXT NOT NULL,\
//     Power FLOAT NOT NULL,\
//     PRIMARY KEY(ProductionID, Type),\
//     FOREIGN KEY(ProductionID) REFERENCES Production(ProductionID))');
//   for (const item of ENERGY_DATA) {
//     addItem(item);
//   }
//   db.parallelize();
//   console.log('Created the \'forecast\' database.') 
// }


// function addItem(item) {
//   // TODO
//   let productionValues = `("${item.date}", ${item.score})`;
//   console.log(productionValues)
//   db.get(`INSERT INTO Production (Date, Score) VALUES ${productionValues} RETURNING ProductionID`, [], (err, row) => {
//     if (err) {
//       console.error(err.message);
//     } else {
//       let productionID = row['ProductionID']; 
//       let detailValues = '';
//       for (let detail of item.productionDetails) {
//         if (detailValues) {
//           detailValues += ", "
//         }
//         detailValues += `(${productionID}, "${detail.type}", ${detail.power})`
//       }
//       db.run(`INSERT INTO Detail VALUES ${detailValues}`, [], (err) => {
//         if (err) {
//           console.error(err.message);
//         } else {
//           // TODO
//         }
//       });
//     }
//   });
// }

// function removeItem(id) {
//   // return item;
// }

// function updateItem(id, item) {
//   // db.run('UPDATE production ')
// }

// function getItem(id) {
//   return getItems(id, id+1).then((rows) => rows[0]);
// }

// function getItems(startId, endId) {
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

// function getItemsCount() {
//   return new Promise((resolve, reject) => {
//     db.get('SELECT COUNT(*) AS Count FROM Production', [], (err, rows) => {
//       if (err) {
//         reject(`Failed to get item: ${err.message}`);
//       } else {
//         resolve(rows.Count);
//       }
//     })
//   });
// }

// module.exports = {
//   addItem,
//   removeItem,
//   updateItem,
//   getItem,
//   getItems,
//   getItemsCount
// }