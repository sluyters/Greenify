const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const ENERGY_DATA = require('../../data');

const DB_PATH = path.resolve(__dirname, './archive.db');

const fillDB = !fs.existsSync(DB_PATH);

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the \'archive\' database.')
  }
});



if (fillDB) {
  db.serialize();
  // Create tables
  db.run('CREATE TABLE IF NOT EXISTS Production (\
    ProductionID INTEGER PRIMARY KEY,\
    Date TEXT NOT NULL,\
    Score FLOAT NOT NULL)');
  db.run('CREATE TABLE IF NOT EXISTS Detail (\
    ProductionID INTEGER NOT NULL,\
    Type TEXT NOT NULL,\
    Power FLOAT NOT NULL,\
    PRIMARY KEY(ProductionID, Type),\
    FOREIGN KEY(ProductionID) REFERENCES Production(ProductionID))');
  for (const item of ENERGY_DATA) {
    addItem(item);
  }
  db.parallelize();
  console.log('Created the \'archive\' database.') 
}


function addItem(item) {
  // TODO
  let productionValues = `("${item.date}", ${item.score})`;
  console.log(productionValues)
  db.get(`INSERT INTO Production (Date, Score) VALUES ${productionValues} RETURNING ProductionID`, [], (err, row) => {
    if (err) {
      console.error(err.message);
    } else {
      let productionID = row['ProductionID']; 
      let detailValues = '';
      for (let detail of item.productionDetails) {
        if (detailValues) {
          detailValues += ", "
        }
        detailValues += `(${productionID}, "${detail.type}", ${detail.power})`
      }
      db.run(`INSERT INTO Detail VALUES ${detailValues}`, [], (err) => {
        if (err) {
          console.error(err.message);
        } else {
          // TODO
        }
      });
    }
  });
}

function removeItem(id) {
  // return item;
}

function updateItem(id, item) {
  // db.run('UPDATE production ')
}

function getItem(id) {
  return getItems(id, id+1).then((rows) => rows[0]);
}

function getItems(startId, endId) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT Production.ProductionID, Production.Date, Production.Score, Type, Power FROM Production JOIN Detail ON Production.ProductionID = Detail.ProductionID WHERE Production.ProductionID >= ${startId} AND Production.ProductionID < ${endId} ORDER BY Production.ProductionID`, [], (err, rows) => {
      if (err) {
        reject(`Failed to get items: ${err.message}`);
      } else if (rows.length === 0) { 
        reject(`Failed to get items: Empty result.`)
      } else {
        let items = []
        let currentID = -1;
        let currentItem = null;
        for (let row of rows) {
          if (row.ProductionID !== currentID) { // Next item
            currentID = row.ProductionID;
            currentItem = {
              id: currentID,
              date: new Date(row.Date),
              score: row.Score,
              totalPower: 0,
              productionDetails: [],
            }
            items.push(currentItem);
          } 
          // Update current item
          currentItem.totalPower += row.Power;
          currentItem.productionDetails.push({
            type: row.Type,
            power: row.Power
          });
        }
        resolve(items);
      }
    });
  });
}

function getItemsCount() {
  return new Promise((resolve, reject) => {
    db.get('SELECT COUNT(*) AS Count FROM Production', [], (err, rows) => {
      if (err) {
        reject(`Failed to get item: ${err.message}`);
      } else {
        resolve(rows.Count);
      }
    })
  });
}

module.exports = {
  addItem,
  removeItem,
  updateItem,
  getItem,
  getItems,
  getItemsCount
}