import { TerrainType } from "../../types/HexTile";
import { Flower } from "./Flower";
import { Mountain } from "./Mountain";
import { PalmTree } from "./PalmTree";
import { Tree } from "./Tree";

// Simple decoration components
export function Decoration({
  terrain,
  height,
}: {
  terrain: TerrainType;
  height: number;
}) {
  // Use a seeded random so the decoration is stable per tile
  // (q, r) is unique per tile
  const rand = Math.abs(Math.sin(height * 1000)) % 1;
  if (rand > 0.3) return null; // ~30% chance to show decoration
  // Add random size variation (between 0.8 and 1.2)
  const sizeRand = 0.8 + (Math.abs(Math.sin(height * 2000 + 42)) % 0.4);

  switch (terrain) {
    case "coast":
      return <PalmTree height={height} size={sizeRand} />;
    case "plains":
      return <Flower height={height} size={sizeRand} />;
    case "hills": {
      // Many trees per tile, more frequent, random positions, sizes, and rotations
      const numTrees = 4 + Math.floor((sizeRand * 10) % 4); // 4-7 per tile
      const trees = Array.from({ length: numTrees }, (_, i) => {
        return <Tree size={sizeRand} height={height} index={i} />;
      });
      return <group>{trees}</group>;
    }
    case "mountains": {
      // Mini mountains: more frequent and more per tile, random positions, sizes, and rotations
      const numMountains = 4 + Math.floor((sizeRand * 10) % 4); // 4-7 per tile
      const mountains = Array.from({ length: numMountains }, (_, i) => {
        return <Mountain size={sizeRand} height={height} index={i} />;
      });
      return <group>{mountains}</group>;
    }
    default:
      return null;
  }
}
