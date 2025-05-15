import type { HexTile, TerrainType } from "../types/HexTile";
import { createNoise2D } from "simplex-noise";
import { randomFn } from "./random";

function generateHexGrid(radius: number): HexTile[] {
  const tiles: HexTile[] = [];
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    for (let r = r1; r <= r2; r++) {
      tiles.push({ q, r, elevation: 0, terrain: "ocean_deep" });
    }
  }
  return tiles;
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

export function getTerrainColor(
  terrain: TerrainType,
  elevation: number
): string {
  switch (terrain) {
    case "ocean_deep":
      return `rgb(0, 20, ${Math.floor(60 + elevation * 30)})`;
    case "ocean_mid":
      return `rgb(0, 40, ${Math.floor(110 + elevation * 40)})`;
    case "ocean_shallow":
      return `rgb(0, 80, ${Math.floor(180 + elevation * 40)})`;
    case "coast":
      return "#FAEDCA";
    case "plains":
      return "#90B77D";
    case "hills":
      return "#6B8E4E";
    case "mountains":
      return "#8B7355";
    default:
      return "gray";
  }
}

function assignElevation(tiles: HexTile[], seed = "world"): HexTile[] {
  const noise2D = createNoise2D(randomFn(seed));
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
    if (e < -0.6) terrain = "ocean_deep";
    else if (e < -0.45) terrain = "ocean_mid";
    else if (e < -0.3) terrain = "ocean_shallow";
    else if (e < -0.1) terrain = "coast";
    else if (e < 0.2) terrain = "plains";
    else if (e < 0.4) terrain = "hills";
    else terrain = "mountains";
    return { ...tile, terrain };
  });
}
