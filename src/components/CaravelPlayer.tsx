import React from "react";

interface CaravelPlayerProps {
  x: number;
  y: number;
}

const CaravelPlayer: React.FC<CaravelPlayerProps> = ({ x, y }) => {
  const triangleStyle: React.CSSProperties = {
    position: "absolute",
    left: `${x}px`,
    top: `${y}px`,
    width: 0,
    height: 0,
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderBottom: "20px solid red",
    transform: "translate(-50%, -100%)",
  };

  return <div style={triangleStyle}></div>;
};

export default CaravelPlayer;
