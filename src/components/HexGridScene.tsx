import React from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { DoubleSide, TextureLoader } from "three";
import { generateHexMap, axialToPoint } from "../hexMapGenerator";
import { OrbitControls } from "@react-three/drei";
import type { HexTile, TerrainType } from "../types/HexTile";

// Map terrain types to texture file names (place textures in src/assets/)
const terrainTextures: Record<TerrainType, string> = {
  deep_ocean: "ocean.jpg",
  mid_ocean: "ocean.jpg",
  shallow_ocean: "ocean.jpg",
  coast: "coast.jpg",
  plains: "plains.jpg",
  hills: "hills.jpg",
  mountains: "mountains.jpg",
};

interface HexTileProps {
  tile: HexTile;
  size?: number;
  textures: Record<TerrainType, any>;
}

function getTerrainColor(terrain: TerrainType, elevation: number): string {
  switch (terrain) {
    case "deep_ocean":
      return `rgb(0, 20, ${Math.floor(60 + elevation * 30)})`;
    case "mid_ocean":
      return `rgb(0, 40, ${Math.floor(110 + elevation * 40)})`;
    case "shallow_ocean":
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

function HexTile({ tile, size = 1, textures }: Readonly<HexTileProps>) {
  const [px, pz] = axialToPoint(tile.q, tile.r, size);

  // Base height for different terrain types
  const baseHeight =
    {
      deep_ocean: 0.07,
      mid_ocean: 0.1,
      shallow_ocean: 0.13,
      coast: 0.2,
      plains: 0.3,
      hills: 0.5,
      mountains: 0.8,
    }[tile.terrain] || 0.1;

  // Add elevation variation
  const height = baseHeight * (1 + tile.elevation * 0.5);

  const texture = textures[tile.terrain];
  const color = getTerrainColor(tile.terrain, tile.elevation);

  return (
    <mesh position={[px, height / 2, pz]}>
      <cylinderGeometry args={[size, size, height, 6]} />
      <meshStandardMaterial
        transparent={true}
        opacity={
          tile.terrain === "shallow_ocean" || tile.terrain === "deep_ocean"
            ? 0.5
            : 1
        }
        side={DoubleSide}
        map={texture}
        color={color}
      />
    </mesh>
  );
}

function HexTiles({
  tiles,
  size,
}: Readonly<{ tiles: HexTile[]; size: number }>) {
  // Load all textures once
  const texturesArr = useLoader(
    TextureLoader,
    Object.values(terrainTextures).map((file) => `/src/assets/textures/${file}`)
  );
  const textures: Record<TerrainType, any> = {
    deep_ocean: texturesArr[0],
    mid_ocean: texturesArr[1],
    shallow_ocean: texturesArr[2],
    coast: texturesArr[3],
    plains: texturesArr[4],
    hills: texturesArr[5],
    mountains: texturesArr[6],
  };

  return (
    <>
      {tiles.map((tile) => (
        <HexTile
          key={`${tile.q}-${tile.r}`}
          tile={tile}
          size={size}
          textures={textures}
        />
      ))}
    </>
  );
}

export function HexGridScene() {
  const randomSeed = Math.random().toString(36).substring(2, 15);
  // Generate a hex map with a random seed
  const tiles = generateHexMap(12, randomSeed);
  const hexSize = 1;

  return (
    <Canvas camera={{ position: [5, 30, 40], fov: 45 }}>
      <OrbitControls />
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <HexTiles tiles={tiles} size={hexSize} />
    </Canvas>
  );
}

export default HexGridScene;
