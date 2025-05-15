// Palm tree: thinner, taller trunk, smaller green top, add a slanted trunk for a more palm-like look

export const PalmTree = ({
  height,
  size,
}: {
  height: number;
  size: number;
}) => {
  return (
    <group
      position={[0, height / 2 + 0.18 * size, 0]}
      scale={[size, size, size]}
    >
      <mesh rotation={[0, 0, Math.PI / 10]}>
        <cylinderGeometry args={[0.018, 0.028, 0.38, 8]} />
        <meshStandardMaterial color="#8B7355" />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color="#3cb371" />
      </mesh>
      {/* Palm leaves: 4 flat green ellipses */}
      {[...Array(4)].map((_, i) => (
        <mesh
          key={i}
          position={[0, 0.22, 0]}
          rotation={[0, 0, (Math.PI / 2) * i]}
        >
          <cylinderGeometry args={[0.01, 0.01, 0.18, 8]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>
      ))}
    </group>
  );
};
