import React from "react";
import { Vector3, BufferGeometry, LineBasicMaterial, Line } from "three";
import { useThree, useFrame } from "@react-three/fiber";

interface NodeProps {
  position: Vector3;
  color?: string;
}

export const Node: React.FC<NodeProps> = ({ position, color = "red" }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

interface EdgeProps {
  start: Vector3;
  end: Vector3;
  color?: string;
}

export const Edge: React.FC<EdgeProps> = ({ start, end, color = "blue" }) => {
  // Create a buffer geometry to hold the line vertices
  const geometry = new BufferGeometry().setFromPoints([start, end]);

  // Create a line material with the specified color
  const material = new LineBasicMaterial({ color });

  // Create the line using the geometry and material
  const line = new Line(geometry, material);

  return <primitive object={line} />;
};
