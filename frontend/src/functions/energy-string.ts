const ENERGY_STRINGS: { [key: string]: string } = {
  'biomass': 'Biomass',
  'coal': 'Coal',
  'geothermal': 'Geothermal',
  'hydro': 'Hydro',
  'natural-gas': 'Natural gas',
  'nuclear': 'Nuclear',
  'petrol': 'Oil',
  'solar': 'Solar',
  'wind-offshore': 'Wind (offshore)',
  'wind-onshore': 'Wind (onshore)',
  'other': 'Other'
}

export function getEnergyString(name: string): string {
  if (Object.prototype.hasOwnProperty.call(ENERGY_STRINGS, name)) {
    return ENERGY_STRINGS[name];
  } else {
    return ENERGY_STRINGS.other;
  }
}