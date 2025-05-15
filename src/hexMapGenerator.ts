import type { HexTile, TerrainType } from "./types/HexTile";
import { createNoise2D } from "simplex-noise";

function generateHexGrid(radius: number): HexTile[] {
  const tiles: HexTile[] = [];
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    for (let r = r1; r <= r2; r++) {
      tiles.push({ q, r, elevation: 0, terrain: "deep_ocean" });
    }
  }
  return tiles;
}

function assignElevation(tiles: HexTile[], seed = "world"): HexTile[] {
  // Use a seeded random function compatible with simplex-noise
  const randomFn = (() => {
    // Simple mulberry32 PRNG for deterministic randomness
    let h =
      1779033703 ^ seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      h ^= h >>> 16;
      return (h >>> 0) / 4294967296;
    };
  })();

  const noise2D = createNoise2D(randomFn);
  return tiles.map((tile) => {
    const nx = tile.q / 20;
    const ny = tile.r / 20;
    const elevation = noise2D(nx, ny); // [-1, 1]
    return { ...tile, elevation };
  });
}

function assignTerrain(tiles: HexTile[]): HexTile[] {
  return tiles.map((tile) => {
    const e = tile.elevation;
    let terrain: TerrainType;
    if (e < -0.6) terrain = "deep_ocean";
    else if (e < -0.45) terrain = "mid_ocean";
    else if (e < -0.3) terrain = "shallow_ocean";
    else if (e < -0.1) terrain = "coast";
    else if (e < 0.2) terrain = "plains";
    else if (e < 0.4) terrain = "hills";
    else terrain = "mountains";
    return { ...tile, terrain };
  });
}

export function generateHexMap(radius: number, seed = "world"): HexTile[] {
  let tiles = generateHexGrid(radius);
  tiles = assignElevation(tiles, seed);
  tiles = assignTerrain(tiles);
  return tiles;
}

// Helper function to convert axial coordinates to 2D position
export function axialToPoint(
  q: number,
  r: number,
  size: number = 1
): [number, number] {
  // For pointy-topped hexes:
  const x = size * Math.sqrt(3) * (q + r / 2);
  const z = size * 1.5 * r;
  return [x, z];
}
