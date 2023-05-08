import React, { useState, useRef } from "react";
import { Box3, Vector3, BufferGeometry, LineBasicMaterial, Line } from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

interface NodeProps {
  position: Vector3;
  color?: string;
  data?: any;
  selectedColor?: string;
  onClick?: () => void;
  onHover?: () => void;
}

export const Node: React.FC<NodeProps> = ({
  position,
  color = "red",
  data = null,
  selectedColor = "green",
  onClick,
  onHover
}) => {
  const [selected, setSelected] = useState(false);
  const textRef = useRef<THREE.Object3D>(null);
  const { camera } = useThree();
  const textPosition = useRef<Vector3>(new Vector3());

  const handleClick = () => {
    setSelected(!selected);
    if (onClick) onClick();
  };

  const handleHover = () => {
    if (onHover) onHover();
  };

  // const handleTextSync = (self: any) => {
  //   const box = new Box3().setFromObject(self);
  //   const boxCenter = box.getCenter(new Vector3());
  //   textPosition.current.add(boxCenter);
  // };

  useFrame(() => {
    if (textRef.current) {
      textRef.current.lookAt(camera.position);
      // Calculate the direction from the camera to the node.
      const direction = new Vector3()
        .subVectors(position, position)
        .normalize();

      // Move the text slightly in front of the node along the direction vector.
      const textOffset = direction.clone().multiplyScalar(0.3);
      textRef.current.position.copy(position.clone().add(textOffset));
    }
  });

  return (
    <>
      <mesh position={position} onContextMenu={handleClick} onPointerEnter={handleHover}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={selected ? selectedColor : color} />
      </mesh>

      {data ? (
        <>
          <mesh position={[position.x, position.y, position.z]}>
            <Text
              ref={textRef}
              fontSize={0.3}
              color="black"
              anchorX="center"
              anchorY="bottom-baseline"
            >
              {JSON.stringify(data)}
            </Text>
            /* <Edge start={position} end={textPosition.current} /> */
          </mesh>
        </>
      ) : (
        ""
      )}
    </>
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
  const material = new LineBasicMaterial({ color: color, linewidth: 0.01 });

  // Create the line using the geometry and material
  const line = new Line(geometry, material);

  return <primitive object={line} />;
};
