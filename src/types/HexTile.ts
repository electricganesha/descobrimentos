export type TerrainType =
  | "deep_ocean"
  | "mid_ocean"
  | "shallow_ocean"
  | "coast"
  | "plains"
  | "hills"
  | "mountains";

export interface HexTile {
  q: number; // axial coordinate
  r: number;
  elevation: number; // -1 (deep ocean) to 1 (high mountains)
  terrain: TerrainType;
  biome?: string; // Optional for later (e.g., rainforest)
}
