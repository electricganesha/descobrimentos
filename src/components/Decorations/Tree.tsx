export const Tree = ({
  index,
  height,
  size,
}: {
  index: number;
  height: number;
  size: number;
}) => {
  const tRand = Math.abs(Math.sin(height * 4000 + index * 321.123)) % 1;
  const tSize = 0.6 + tRand * 0.7; // scale 0.6-1.3
  const tX = (Math.sin(height * 150 + index * 5) % 1) * 0.22 - 0.11; // -0.11 to 0.11
  const tZ = (Math.cos(height * 250 + index * 9) % 1) * 0.22 - 0.11; // -0.11 to 0.11
  const tRot = tRand * Math.PI * 2;

  return (
    <group
      key={index}
      position={[tX, height / 2 + 0.18 * tSize, tZ]}
      scale={[tSize * size, tSize * size, tSize * size]}
      rotation={[0, tRot, 0]}
    >
      <mesh>
        <cylinderGeometry args={[0.025, 0.025, 0.12, 6]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
      <mesh position={[0, 0.09, 0]}>
        <coneGeometry args={[0.09, 0.18, 8]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
    </group>
  );
};
