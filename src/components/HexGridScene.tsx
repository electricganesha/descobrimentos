import React from "react";
import { Canvas } from "@react-three/fiber";
import { generateHexMap, TileType } from "../hexMapGenerator";
import { OrbitControls } from "@react-three/drei";

interface HexTileProps {
  type: TileType;
  x: number;
  y: number;
  adjacency: number;
  totalCols: number;
  totalRows: number;
}

function getHexPosition(
  x: number,
  y: number,
  totalCols: number,
  totalRows: number
): [number, number] {
  // For a pointy-top hex layout
  const r = 0.5;
  const w = Math.sqrt(3) * r; // width of a single hex
  const h = 2 * r; // height of a single hex
  const vSpacing = 0.75 * h;
  const xOffset = (y % 2) * (w / 2);

  // Basic grid position for this hex
  const rawX = x * w + xOffset;
  const rawY = y * vSpacing;

  // Compute total map dimensions
  const mapWidth = totalCols * w;
  const mapHeight = totalRows * vSpacing;

  // Shift everything so the center is roughly at (0,0)
  const centerOffsetX = mapWidth / 2 - w / 2;
  const centerOffsetY = mapHeight / 2 - vSpacing / 2;

  const finalX = rawX - centerOffsetX;
  const finalY = rawY - centerOffsetY;

  return [finalX, finalY];
}

function HexTile({
  type,
  x,
  y,
  adjacency,
  totalCols,
  totalRows,
}: HexTileProps) {
  const [px, py] = getHexPosition(x, y, totalCols, totalRows);

  // Keep base tile height consistent:
  const tileHeight = 0.1;

  // Use adjacency to vary surface features:
  // For example, each adjacent land tile can raise the land slightly.
  const surfaceVariation = type === "land" ? adjacency * 0.05 : 0;
  const finalHeight = tileHeight + surfaceVariation;

  const color = type === "ocean" ? "blue" : "green";

  return (
    <mesh position={[px, finalHeight / 2, py]}>
      <cylinderGeometry args={[0.5, 0.5, finalHeight, 6]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function getLandNeighborsCount(
  map: TileType[][],
  x: number,
  y: number
): number {
  // For pointy-top hex, the six neighbor offsets could be:
  const neighbors = [
    [x + 1, y],
    [x - 1, y],
    [x, y - 1],
    [x, y + 1],
    [x + (y % 2 === 0 ? -1 : 1), y - 1],
    [x + (y % 2 === 0 ? -1 : 1), y + 1],
  ];

  let count = 0;
  for (const [nx, ny] of neighbors) {
    if (
      ny >= 0 &&
      ny < map.length &&
      nx >= 0 &&
      nx < map[ny].length &&
      map[ny][nx] === "land"
    ) {
      count++;
    }
  }
  return count;
}

export function HexGridScene() {
  const map = generateHexMap(25, 25);
  const totalRows = map.length;
  const totalCols = map[0].length;

  // Precompute adjacency for land
  const adjacencyMap = map.map((row, y) =>
    row.map((tile, x) => {
      if (tile === "land") {
        return getLandNeighborsCount(map, x, y);
      }
      return 0;
    })
  );

  return (
    <Canvas camera={{ position: [5, 25, 25], fov: 30 }}>
      <OrbitControls />
      <ambientLight intensity={0.7} />
      <directionalLight position={[0, 100, 0]} intensity={0.5} />
      {map.map((row, y) =>
        row.map((tile, x) => (
          <HexTile
            key={`${x}-${y}`}
            type={tile}
            x={x}
            y={y}
            adjacency={adjacencyMap[y][x]}
            totalCols={totalCols}
            totalRows={totalRows}
          />
        ))
      )}
    </Canvas>
  );
}

export default HexGridScene;
