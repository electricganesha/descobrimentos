import React, { useState, useMemo, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { generateHexMap } from "../../utils/hexmap";
import { OrbitControls } from "@react-three/drei";
import type { HexTile, TerrainType } from "../../types/HexTile";
import { HexTileComponent } from "./HexTile";
import { Player, PlayerHandle } from "../Player/Player";

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
  onClick,
}: Readonly<{
  tiles: HexTile[];
  size: number;
  onHover: (tile: HexTile) => void;
  onUnhover: () => void;
  hoveredTile: HexTile | null;
  onClick?: (tile: HexTile) => void;
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
          onClick={onClick ? () => onClick(tile) : undefined}
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
  const [playerPos, setPlayerPos] = useState<{ q: number; r: number }>({
    q: 0,
    r: 0,
  });
  const playerRef = useRef<PlayerHandle>(null);
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

  // Keyboard movement (pointy-topped hex axial directions)
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      let dq = 0,
        dr = 0;
      // WASD or arrow keys
      if (e.key === "ArrowUp" || e.key === "w") {
        dq = 0;
        dr = -1;
      } else if (e.key === "ArrowDown" || e.key === "s") {
        dq = 0;
        dr = 1;
      } else if (e.key === "ArrowLeft" || e.key === "a") {
        dq = -1;
        dr = 0;
      } else if (e.key === "ArrowRight" || e.key === "d") {
        dq = 1;
        dr = 0;
      } else if (e.key === "q") {
        dq = -1;
        dr = 1;
      } else if (e.key === "e") {
        dq = 1;
        dr = -1;
      }
      if (dq !== 0 || dr !== 0) {
        setPlayerPos((pos) => {
          const newQ = pos.q + dq;
          const newR = pos.r + dr;
          if (playerRef.current) playerRef.current.setPosition(newQ, newR);
          return { q: newQ, r: newR };
        });
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click-to-move: move player to clicked tile
  function handleTileClick(tile: HexTile) {
    setPlayerPos({ q: tile.q, r: tile.r });
    if (playerRef.current) playerRef.current.setPosition(tile.q, tile.r);
  }

  // Find the current tile for the player
  const playerTile = tiles.find(
    (t) => t.q === playerPos.q && t.r === playerPos.r
  );
  const playerTerrain = playerTile ? playerTile.terrain : "ocean_deep";
  // Compute the tile height as in HexTileComponent
  const baseHeight =
    playerTerrain === "ocean_deep"
      ? 0.07
      : playerTerrain === "ocean_mid"
      ? 0.1
      : playerTerrain === "ocean_shallow"
      ? 0.13
      : playerTerrain === "coast"
      ? 1.1
      : playerTerrain === "plains"
      ? 1.2
      : playerTerrain === "hills"
      ? 1.6
      : playerTerrain === "mountains"
      ? 2.1
      : 0.1;
  const tileHeight = playerTile
    ? baseHeight * (1 + playerTile.elevation * 0.5)
    : 0.1;

  return (
    <Canvas camera={{ position: [5, 30, 40], fov: 45 }}>
      <OrbitControls />
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      {/* Render hex tiles using HexTiles, passing onClick to each tile */}
      <HexTiles
        tiles={tiles}
        size={hexSize}
        onHover={handleHover}
        onUnhover={handleUnhover}
        hoveredTile={hoveredTile}
        onClick={handleTileClick}
      />
      {/* Render the player */}
      <Player
        ref={playerRef}
        q={playerPos.q}
        r={playerPos.r}
        size={hexSize}
        terrain={playerTerrain}
        tileHeight={tileHeight / 2}
      />
    </Canvas>
  );
}

export default HexGridScene;
