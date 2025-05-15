export const Flower = ({ height, size }: { height: number; size: number }) => {
  // Flower: green stem + pink sphere
  return (
    <group
      position={[0, height / 2 + 0.08 * size, 0]}
      scale={[size, size, size]}
    >
      <mesh>
        <cylinderGeometry args={[0.015, 0.015, 0.08, 6]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#ff69b4" />
      </mesh>
    </group>
  );
};
