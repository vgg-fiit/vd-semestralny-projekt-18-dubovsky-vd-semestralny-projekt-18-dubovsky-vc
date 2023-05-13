import React, { useState, useRef, useEffect } from "react";
import { Box3, Vector3, BufferGeometry, LineBasicMaterial, Line } from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { Plane, Text } from "@react-three/drei";

interface NodeProps {
  position: Vector3;
  color?: string;
  hoverData?: any;
  staticData?: any;
  selectedColor?: string;
  isSelected?: boolean;
  onClick?: () => void;
  onHover?: () => void;
}

export const Node: React.FC<NodeProps> = ({
  position,
  color = "red",
  hoverData = null,
  staticData = null,
  selectedColor = "green",
  isSelected = false,
  onClick,
  onHover,
}) => {
  const [selected, setSelected] = useState(isSelected);
  const [isHovered, setIsHovered] = useState(false);

  const textRef = useRef<THREE.Object3D>(null);
  const { camera } = useThree();
  const textPosition = useRef<Vector3>(new Vector3());

  const textOffset = new Vector3(0, 0.3, 0);

  // console.log(position, upperTextPosition, bottomTextPosition);

  const handleClick = () => {
    // setSelected(!selected);
    if (onClick) onClick();
  };

  const handleHover = () => {
    if (onHover) onHover();
  };

  const handleTextSync = (self: any) => {
    const box = new Box3().setFromObject(self);

    const boxCenter = box.getCenter(new Vector3());
    textPosition.current.add(boxCenter);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    if (onHover) {
      onHover();
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  useFrame(() => {
    if (textRef.current) {
      textRef.current.lookAt(camera.position);

      textRef.current.position.copy(position.clone().add(textOffset));
    }
  });

  useEffect(() => {
    setSelected(isSelected);
  }, [isSelected]);

  return (
    <>
      <mesh
        position={position}
        onContextMenu={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={selected ? selectedColor : color} />
      </mesh>

      {staticData && !isHovered ? (
        <Text
          position={position}
          ref={textRef}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="bottom"
        >
          {JSON.stringify(staticData, null, 2)}
        </Text>
      ) : (
        ""
      )}

      {hoverData && isHovered ? (
        <group>
          <Text
            position={position}
            ref={textRef}
            fontSize={0.3}
            color="black"
            anchorX="center"
            anchorY="bottom"
          >
            {JSON.stringify(hoverData, null, 2)}
          </Text>
        </group>
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
