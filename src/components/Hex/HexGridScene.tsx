import React, { useState, useMemo, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { generateHexMap } from "../../utils/hexmap";
import { OrbitControls } from "@react-three/drei";
import type { HexTile, TerrainType } from "../../types/HexTile";
import { HexTileComponent } from "./HexTile";

// Map terrain types to texture file names (place textures in src/assets/)
const terrainTextures: Record<TerrainType, string> = {
  ocean_deep: "ocean.jpg",
  ocean_mid: "ocean.jpg",
  ocean_shallow: "ocean.jpg",
  coast: "coast.jpg",
  plains: "plains.jpg",
  hills: "hills.jpg",
  mountains: "mountains.jpg",
};

function HexTiles({
  tiles,
  size,
  onHover,
  onUnhover,
  hoveredTile,
}: Readonly<{
  tiles: HexTile[];
  size: number;
  onHover: (tile: HexTile) => void;
  onUnhover: () => void;
  hoveredTile: HexTile | null;
}>) {
  // Load all textures once
  const texturesArr = useLoader(
    TextureLoader,
    Object.values(terrainTextures).map((file) => `/src/assets/textures/${file}`)
  );
  const textures: Record<TerrainType, any> = {
    ocean_deep: texturesArr[0],
    ocean_mid: texturesArr[1],
    ocean_shallow: texturesArr[2],
    coast: texturesArr[3],
    plains: texturesArr[4],
    hills: texturesArr[5],
    mountains: texturesArr[6],
  };

  return (
    <>
      {tiles.map((tile) => (
        <HexTileComponent
          key={`${tile.q}-${tile.r}`}
          tile={tile}
          size={size}
          textures={textures}
          onHover={onHover}
          onUnhover={onUnhover}
          hovered={
            hoveredTile
              ? hoveredTile.q === tile.q && hoveredTile.r === tile.r
              : false
          }
        />
      ))}
    </>
  );
}

export function HexGridScene() {
  const [randomSeed] = useState(() =>
    Math.random().toString(36).substring(2, 15)
  );
  const tiles = useMemo(() => generateHexMap(12, randomSeed), [randomSeed]);
  const hexSize = 1;
  const [hoveredTile, setHoveredTile] = useState<HexTile | null>(null);
  const hoverOutTimeout = useRef<number | null>(null);

  const handleHover = (tile: HexTile) => {
    if (hoverOutTimeout.current) {
      clearTimeout(hoverOutTimeout.current);
      hoverOutTimeout.current = null;
    }
    setHoveredTile(tile);
  };

  const handleUnhover = () => {
    if (hoverOutTimeout.current) {
      clearTimeout(hoverOutTimeout.current);
    }
    hoverOutTimeout.current = setTimeout(() => {
      setHoveredTile(null);
    }, 150);
  };

  return (
    <Canvas camera={{ position: [5, 30, 40], fov: 45 }}>
      <OrbitControls />
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <HexTiles
        tiles={tiles}
        size={hexSize}
        onHover={handleHover}
        onUnhover={handleUnhover}
        hoveredTile={hoveredTile}
      />
    </Canvas>
  );
}

export default HexGridScene;
