export type EnergyProductionDay = { 
  date: string,
  avgPrice: number,
  avgPower: {[key: string]: number},
  score: number,
  totalPower: number,
};

export type PowerDetail = {
  dateTime: string,
  score: number,
  totalPower: number,
  power: {[key: string]: number},
}

export type PriceDetail = {
  dateTime: string,
  price: number,
}

export type EnergyProductionDayDetail = {
  date: string,
  avgPrice: number,
  avgPower: {[key: string]: number},
  score: number,
  totalPower: number,
  power: PowerDetail[],
  price: PriceDetail[],
}