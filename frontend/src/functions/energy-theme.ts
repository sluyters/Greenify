export function getEnergyTheme(score: number) {
  if (score >= 4 / 7) { // A, B, C
    return 0;
  } else if (score >= 2 / 7) { // D, E
    return 1;
  } else { // F, G
    return 2;
  }
}