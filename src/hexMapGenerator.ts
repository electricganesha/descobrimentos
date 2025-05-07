export type TileType = "ocean" | "land";

export function generateHexMap(width: number, height: number): TileType[][] {
  const map: TileType[][] = [];

  for (let y = 0; y < height; y++) {
    const row: TileType[] = [];
    for (let x = 0; x < width; x++) {
      // Simple random generation
      row.push(Math.random() < 0.6 ? "ocean" : "land");
    }
    map.push(row);
  }

  return map;
}
