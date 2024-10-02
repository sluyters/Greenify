const ENERGY_STRINGS: { [key: string]: string } = {
  'CP': 'Coal pulverized',
  'WA': 'Water',
  'NG': 'Natural gas',
  'NU': 'Nuclear',
  'LF': 'Liquid fuel',
  'SO': 'Solar',
  'WI': 'Wind',
  'OTHER': 'Other'
}

export function getEnergyString(name: string): string {
  if (Object.prototype.hasOwnProperty.call(ENERGY_STRINGS, name)) {
    return ENERGY_STRINGS[name];
  } else {
    return ENERGY_STRINGS.other;
  }
}