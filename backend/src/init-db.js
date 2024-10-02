/**
 * Initialize a database with 2 tables: Actual and Forecast
 * TODO execute first (before running app)
 */ 
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.resolve(__dirname, './greenify.db');
const FILL_DB = true;

const TYPES = ['CP', 'LF', 'NG', 'NU', 'SO', 'WA', 'WI', 'OTHER'];

// Generate dummy row
function generateFuelRows(prevRow) {
  return TYPES.map((type, index) => {
    return {
      type: type,
      power: prevRow ? Math.max(0, prevRow[index].power + (Math.random() - 0.5) * 60) : Math.random() * 300
    }
  })
}

function generateEnergyRow(prevRow) {
  return {
    date: prevRow ? new Date(prevRow.date.getTime() - 15 * 60000) : new Date(((Math.round(new Date().valueOf() / 86400000) * 86400000) + 7 * 86400000)),
    price: prevRow ? prevRow.price + (Math.random() - 0.5): Math.random() * 30 + 10,
    fuel: generateFuelRows(prevRow ? prevRow.fuel : null)
  }
}

// Check if the database exists
const initializeDB = !fs.existsSync(DB_PATH);

// Connect to the database (create if it does not exist)
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the database.')
  }
});

// Initialize the the DB if it did not exist
if (initializeDB) {
  db.serialize();
  // Create tables
  db.run('CREATE TABLE IF NOT EXISTS PriceForecast (\
    ID INTEGER PRIMARY KEY,\
    DateTime TEXT NOT NULL UNIQUE,\
    Price DECIMAL(8,2) NOT NULL)'); 
  db.run('CREATE TABLE IF NOT EXISTS PowerForecast (\
    ID INTEGER PRIMARY KEY,\
    DateTime TEXT NOT NULL,\
    Type TEXT NOT NULL,\
    Power DECIMAL(20,1) NOT NULL,\
    UNIQUE(DateTime, Type))'); 
  db.run('CREATE TABLE IF NOT EXISTS PriceActual (\
    ID INTEGER PRIMARY KEY,\
    DateTime TEXT NOT NULL UNIQUE,\
    Price DECIMAL(8,2) NOT NULL)');
  db.run('CREATE TABLE IF NOT EXISTS PowerActual (\
    ID INTEGER PRIMARY KEY,\
    DateTime TEXT NOT NULL,\
    Type TEXT NOT NULL,\
    Power DECIMAL(20,1) NOT NULL,\
    UNIQUE(DateTime, Type))'); 
  // Fill in the the DB with dummy data
  if (initializeDB && FILL_DB) {
    // Generate dummy data
    let actualData = [];
    let forecastData = [];
    let prev = null;
    for (let i = 0; i < 24 * 4 * 7; i++) {
      prev = generateEnergyRow(prev)
      forecastData.push(prev);   
    }
    for (let i = 0; i < 24 * 4 * 35; i++) {
      prev = generateEnergyRow(prev)
      actualData.push(prev);   
    }
    forecastData = forecastData.slice(1, -1).reverse();
    for (let item of forecastData) {
      addForecast(item)
    }
    actualData = actualData.slice(1, -1).reverse();
    for (let item of actualData) {
      addActual(item);
    }
  }
  db.parallelize();
  // db.close();
  console.log('Filled the database with dummy data.')
}

function addForecast(forecast) {
  db.run('INSERT INTO PriceForecast (DateTime, Price) VALUES ($date, $price) RETURNING ID', {
    $date: forecast.date.toISOString(),
    $price: forecast.price.toString()
  }, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      for (let fuel of forecast.fuel) {
        db.run('INSERT INTO PowerForecast (DateTime, Type, Power) VALUES ($date, $type, $power)', {
          $date: forecast.date.toISOString(),
          $type: fuel.type,
          $power: fuel.power.toString()
        }, (err) => {
          if (err) {
            console.error(err.message);
          }
        });
      }
    }
  });
}

function addActual(actual) {
  db.run('INSERT INTO PriceActual (DateTime, Price) VALUES ($date, $price) RETURNING ID', {
    $date: actual.date.toISOString(),
    $price: actual.price.toString()
  }, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      for (let fuel of actual.fuel) {
        db.run('INSERT INTO PowerActual (DateTime, Type, Power) VALUES ($date, $type, $power)', {
          $date: actual.date.toISOString(),
          $type: fuel.type,
          $power: fuel.power.toString()
        }, (err) => {
          if (err) {
            console.error(err.message);
          }
        });
      }
    }
  });
}