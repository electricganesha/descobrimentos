import { Html, useCursor } from "@react-three/drei";
import { Tooltip } from "../UI/Tooltip";
import { DoubleSide } from "three";
import { axialToPoint, getTerrainColor } from "../../utils/hexmap";
import { HexTile, TerrainType } from "../../types/HexTile";

interface HexTileProps {
  tile: HexTile;
  size?: number;
  textures: Record<TerrainType, any>;
}

export const HexTileComponent = ({
  tile,
  size = 1,
  textures,
  onHover,
  onUnhover,
  hovered = false,
}: Readonly<
  HexTileProps & {
    onHover?: (tile: HexTile) => void;
    onUnhover?: () => void;
    hovered?: boolean;
  }
>) => {
  const [px, pz] = axialToPoint(tile.q, tile.r, size);

  // Base height for different terrain types
  const baseHeight =
    {
      ocean_deep: 0.07,
      ocean_mid: 0.1,
      ocean_shallow: 0.13,
      coast: 0.2,
      plains: 0.3,
      hills: 0.5,
      mountains: 0.8,
    }[tile.terrain] || 0.1;

  // Add elevation variation
  const height = baseHeight * (1 + tile.elevation * 0.5);

  const texture = textures[tile.terrain];
  const color = getTerrainColor(tile.terrain, tile.elevation);
  const highlightColor = hovered ? "#FFFF00" : color;
  useCursor(hovered);

  return (
    <mesh
      position={[px, height / 2, pz]}
      onPointerOver={
        onHover
          ? (e) => {
              e.stopPropagation();
              onHover(tile);
            }
          : undefined
      }
      onPointerOut={
        onUnhover
          ? (e) => {
              e.stopPropagation();
              onUnhover();
            }
          : undefined
      }
    >
      <cylinderGeometry args={[size, size, height, 6]} />
      <meshStandardMaterial
        transparent={
          tile.terrain === "ocean_shallow" || tile.terrain === "ocean_deep"
        }
        opacity={
          tile.terrain === "ocean_shallow" || tile.terrain === "ocean_deep"
            ? 0.5
            : 1
        }
        side={DoubleSide}
        map={texture}
        color={highlightColor}
      />
      {hovered && (
        <>
          {/* Line from tile center to tooltip */}
          <lineSegments renderOrder={1} raycast={() => {}}>
            <bufferGeometry attach="geometry">
              <bufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array([
                    0,
                    height / 2,
                    0, // tile center top
                    0,
                    height / 2 + 5,
                    0, // tooltip base (matches Html position)
                  ]),
                  3,
                ]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#fff" linewidth={2} />
          </lineSegments>
          <Html
            center
            style={{ pointerEvents: "none" }}
            position={[0, height / 2 + 5, 0]}
          >
            <Tooltip>
              <div>
                <b>q:</b> {tile.q}, <b>r:</b> {tile.r}
              </div>
              <hr />
              <div>
                <b>Elevation:</b> {tile.elevation.toFixed(2)}
              </div>
              <hr />
              <div>
                <b>Terrain:</b> {tile.terrain}
              </div>
            </Tooltip>
          </Html>
        </>
      )}
    </mesh>
  );
};
