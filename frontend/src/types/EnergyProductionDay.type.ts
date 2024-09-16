import type { EnergyProductionType } from "./EnergyProductionType.type";

export type EnergyProductionDay = { 
  id: number,
  date: Date,
  productionScore: number,
  totalPower: number,
  productionDetails: EnergyProductionType[]
};