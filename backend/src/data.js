const ENERGY_DATA = [
  {
    id: 0,
    date: new Date('2024-09-12').toISOString(),
    score: 0.7,
    totalPower: 15000,
    productionDetails: [
      {
        type: 'wind-offshore',
        isForecast: false,
        power: 3000
      },
      {
        type: 'solar',
        isForecast: false,
        power: 1000
      },
      {
        type: 'nuclear',
        isForecast: false,
        power: 2000
      },
      {
        type: 'biomass',
        isForecast: true,
        power: 0
      },
      {
        type: 'coal',
        isForecast: true,
        power: 1000
      },
      {
        type: 'wind-onshore',
        isForecast: true,
        power: 2500
      },
      {
        type: 'petrol',
        isForecast: true,
        power: 0
      },
      {
        type: 'natural-gas',
        isForecast: true,
        power: 1500
      },
      {
        type: 'hydro',
        isForecast: true,
        power: 1700
      },
      {
        type: 'geothermal',
        isForecast: true,
        power: 1300
      }
    ]
  },
  {
    id: 1,
    date: new Date('2024-09-13').toISOString(),
    score: 0.0,
    totalPower: 15000,
    productionDetails: [
      {
        type: 'wind-offshore',
        isForecast: false,
        power: 3000
      },
      {
        type: 'solar',
        isForecast: false,
        power: 1000
      },
      {
        type: 'nuclear',
        isForecast: false,
        power: 2000
      },
      {
        type: 'biomass',
        isForecast: true,
        power: 0
      },
      {
        type: 'coal',
        isForecast: true,
        power: 1000
      },
      {
        type: 'wind-onshore',
        isForecast: true,
        power: 2500
      },
      {
        type: 'petrol',
        isForecast: true,
        power: 0
      },
      {
        type: 'natural-gas',
        isForecast: true,
        power: 1500
      },
      {
        type: 'hydro',
        isForecast: true,
        power: 1700
      },
      {
        type: 'geothermal',
        isForecast: true,
        power: 1300
      }
    ]
  },
  {
    id: 2,
    date: new Date('2024-09-14').toISOString(),
    score: 0.7,
    totalPower: 15000,
    productionDetails: [
      {
        type: 'wind-offshore',
        isForecast: false,
        power: 3000
      },
      {
        type: 'solar',
        isForecast: false,
        power: 1000
      },
      {
        type: 'nuclear',
        isForecast: false,
        power: 2000
      },
      {
        type: 'biomass',
        isForecast: true,
        power: 0
      },
      {
        type: 'coal',
        isForecast: true,
        power: 1000
      },
      {
        type: 'wind-onshore',
        isForecast: true,
        power: 2500
      },
      {
        type: 'petrol',
        isForecast: true,
        power: 0
      },
      {
        type: 'natural-gas',
        isForecast: true,
        power: 1500
      },
      {
        type: 'hydro',
        isForecast: true,
        power: 1700
      },
      {
        type: 'geothermal',
        isForecast: true,
        power: 1300
      }
    ]
  },
  {
    id: 3,
    date: new Date('2024-09-15').toISOString(),
    score: 0.2,
    totalPower: 15000,
    productionDetails: [
      {
        type: 'wind-offshore',
        isForecast: false,
        power: 3000
      },
      {
        type: 'solar',
        isForecast: false,
        power: 1000
      },
      {
        type: 'nuclear',
        isForecast: false,
        power: 2000
      },
      {
        type: 'biomass',
        isForecast: true,
        power: 0
      },
      {
        type: 'coal',
        isForecast: true,
        power: 1000
      },
      {
        type: 'wind-onshore',
        isForecast: true,
        power: 2500
      },
      {
        type: 'petrol',
        isForecast: true,
        power: 0
      },
      {
        type: 'natural-gas',
        isForecast: true,
        power: 1500
      },
      {
        type: 'hydro',
        isForecast: true,
        power: 1700
      },
      {
        type: 'geothermal',
        isForecast: true,
        power: 1300
      }
    ]
  },
  {
    id: 4,
    date: new Date('2024-09-16').toISOString(),
    score: 0.65,
    totalPower: 15000,
    productionDetails: [
      {
        type: 'wind-offshore',
        isForecast: false,
        power: 3000
      },
      {
        type: 'solar',
        isForecast: false,
        power: 1000
      },
      {
        type: 'nuclear',
        isForecast: false,
        power: 2000
      },
      {
        type: 'biomass',
        isForecast: true,
        power: 0
      },
      {
        type: 'coal',
        isForecast: true,
        power: 1000
      },
      {
        type: 'wind-onshore',
        isForecast: true,
        power: 2500
      },
      {
        type: 'petrol',
        isForecast: true,
        power: 0
      },
      {
        type: 'natural-gas',
        isForecast: true,
        power: 1500
      },
      {
        type: 'hydro',
        isForecast: true,
        power: 1700
      },
      {
        type: 'geothermal',
        isForecast: true,
        power: 1300
      }
    ]
  },
  {
    id: 5,
    date: new Date('2024-09-17').toISOString(),
    score: 0.6,
    totalPower: 15000,
    productionDetails: [
      {
        type: 'wind-offshore',
        isForecast: false,
        power: 3000
      },
      {
        type: 'solar',
        isForecast: false,
        power: 1000
      },
      {
        type: 'nuclear',
        isForecast: false,
        power: 2000
      },
      {
        type: 'biomass',
        isForecast: true,
        power: 0
      },
      {
        type: 'coal',
        isForecast: true,
        power: 1000
      },
      {
        type: 'wind-onshore',
        isForecast: true,
        power: 2500
      },
      {
        type: 'petrol',
        isForecast: true,
        power: 0
      },
      {
        type: 'natural-gas',
        isForecast: true,
        power: 1500
      },
      {
        type: 'hydro',
        isForecast: true,
        power: 1700
      },
      {
        type: 'geothermal',
        isForecast: true,
        power: 1300
      }
    ]
  },
  {
    id: 6,
    date: new Date('2024-09-18').toISOString(),
    score: 0.5,
    totalPower: 15000,
    productionDetails: [
      {
        type: 'wind-offshore',
        isForecast: false,
        power: 3000
      },
      {
        type: 'solar',
        isForecast: false,
        power: 1000
      },
      {
        type: 'nuclear',
        isForecast: false,
        power: 2000
      },
      {
        type: 'biomass',
        isForecast: true,
        power: 0
      },
      {
        type: 'coal',
        isForecast: true,
        power: 1000
      },
      {
        type: 'wind-onshore',
        isForecast: true,
        power: 2500
      },
      {
        type: 'petrol',
        isForecast: true,
        power: 0
      },
      {
        type: 'natural-gas',
        isForecast: true,
        power: 1500
      },
      {
        type: 'hydro',
        isForecast: true,
        power: 1700
      },
      {
        type: 'geothermal',
        isForecast: true,
        power: 1300
      }
    ]
  },
  {
    id: 7,
    date: new Date('2024-09-19').toISOString(),
    score: 0.5,
    totalPower: 15000,
    productionDetails: [
      {
        type: 'wind-offshore',
        isForecast: false,
        power: 3000
      },
      {
        type: 'solar',
        isForecast: false,
        power: 1000
      },
      {
        type: 'nuclear',
        isForecast: false,
        power: 2000
      },
      {
        type: 'biomass',
        isForecast: true,
        power: 0
      },
      {
        type: 'coal',
        isForecast: true,
        power: 1000
      },
      {
        type: 'wind-onshore',
        isForecast: true,
        power: 2500
      },
      {
        type: 'petrol',
        isForecast: true,
        power: 0
      },
      {
        type: 'natural-gas',
        isForecast: true,
        power: 1500
      },
      {
        type: 'hydro',
        isForecast: true,
        power: 1700
      },
      {
        type: 'geothermal',
        isForecast: true,
        power: 1300
      }
    ]
  },
];

module.exports = ENERGY_DATA;