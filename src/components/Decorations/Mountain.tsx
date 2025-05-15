export const Mountain = ({
  height,
  size,
  index,
}: {
  height: number;
  size: number;
  index: number;
}) => {
  // Use a seeded random for each mountain
  const mRand = Math.abs(Math.sin(height * 3000 + index * 123.456)) % 1;
  const mSize = 0.6 + mRand * 0.9; // scale 0.6-1.5
  const mX = (Math.sin(height * 100 + index * 7) % 1) * 0.28 - 0.14; // -0.14 to 0.14
  const mZ = (Math.cos(height * 200 + index * 11) % 1) * 0.28 - 0.14; // -0.14 to 0.14
  const mRot = mRand * Math.PI * 2;
  return (
    <mesh
      key={index}
      position={[mX, height / 2 + 0.18 * mSize, mZ]}
      scale={[mSize * size, mSize * size, mSize * size]}
      rotation={[0, mRot, 0]}
    >
      <coneGeometry args={[0.13, 0.28, 8]} />
      <meshStandardMaterial color="#412B15" />
    </mesh>
  );
};
