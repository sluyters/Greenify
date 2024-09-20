import type { EnergyProductionType } from "./EnergyProductionType.type";

export type EnergyProductionDay = { 
  id: number,
  date: Date,
  score: number,
  totalPower: number,
  productionDetails: EnergyProductionType[]
};