/** 1 nemovitost, 2–4 nemovitosti, 5 nemovitostí. */
export function pocetNemovitosti(n: number): string {
  return `${n} ${n === 1 ? "nemovitost" : n >= 2 && n <= 4 ? "nemovitosti" : "nemovitostí"}`;
}
