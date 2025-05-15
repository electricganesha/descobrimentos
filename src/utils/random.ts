// Use a seeded random function compatible with simplex-noise
export const randomFn = (seed: string) => {
  // Simple mulberry32 PRNG for deterministic randomness
  let h = 1779033703 ^ seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
};
