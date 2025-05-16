import { useRef, useImperativeHandle, forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Group } from "three";
import { axialToPoint } from "../../utils/hexmap";

interface PlayerProps {
  q: number; // axial q coordinate
  r: number; // axial r coordinate
  size?: number; // hex size
  terrain: string; // pass the terrain type for the current tile
  tileHeight: number; // pass the height of the tile (top surface)
}

// Expose a ref API for movement
export interface PlayerHandle {
  setPosition: (q: number, r: number) => void;
}

export const Player = forwardRef<PlayerHandle, PlayerProps>(
  ({ q, r, size = 1, terrain, tileHeight }, ref) => {
    const group = useRef<Group>(null!);
    const { scene: caravelScene } = useGLTF("/src/assets/models/caravel.glb");
    const { scene: personScene } = useGLTF("/src/assets/models/person.glb");
    // Convert axial to world position
    const [x, z] = axialToPoint(q, r, size);
    useImperativeHandle(ref, () => ({
      setPosition: (newQ: number, newR: number) => {
        const [nx, nz] = axialToPoint(newQ, newR, size);
        if (group.current) {
          group.current.position.x = nx;
          group.current.position.z = nz;
        }
      },
    }));
    // Ocean terrain types
    const isOcean = ["ocean_deep", "ocean_mid", "ocean_shallow"].includes(
      terrain
    );
    return (
      <group
        ref={group}
        position={[x, tileHeight, z]}
        scale={[0.25, 0.25, 0.25]}
      >
        <primitive object={isOcean ? caravelScene : personScene} />
      </group>
    );
  }
);

useGLTF.preload("/src/assets/models/caravel.glb");
useGLTF.preload("/src/assets/models/person.glb");
