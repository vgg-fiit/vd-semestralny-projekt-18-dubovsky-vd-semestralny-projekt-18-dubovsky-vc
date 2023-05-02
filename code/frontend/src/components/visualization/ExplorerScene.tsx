import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import { Raycaster, Vector2 } from "three";
import axios from "axios";
// create function componentt
import { Node, Edge } from "./Graph";

interface GraphSceneProps {
  data: any;
  handleNodeSelection: (selected: any) => void;
}

const GraphScene: React.FC<GraphSceneProps> = ({
  data,
  handleNodeSelection,
}) => {
  const [graph, setGraph] = useState<any>([]);
  const [selectedNode, setSelectedNode] = useState<number>(-1);
  const targetNode = useRef<Vector3 | null>(null);
  // Camera and Animation
  const defaultCameraPosition = new Vector3(0, 0, 10);
  const defaultCameraTarget = new Vector3(0, 0, 0);
  const [cameraTarget, setCameraTarget] = useState<Vector3 | null>(
    new Vector3(0, 0, 0)
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const { camera } = useThree();
  const animationDuration = 1000; // 1000 milliseconds = 1 second
  const animationStartTime = useRef<number | null>(null);

  const handleNodeClick = (index: number) => {
    // console.log("clicked", index);
    if (selectedNode === index) {
      setSelectedNode(-1);
    } else {
      setSelectedNode(index);
    }

    const selectedNodePosition = data.nodes.filter(
      (node: any) => node.uuId === index
    )[0].position;

    // console.log(index, selectedNodePosition);

    var targetVector = new Vector3(
      selectedNodePosition.x,
      selectedNodePosition.y,
      selectedNodePosition.z
    );

    if (selectedNode === index) {
      targetVector = defaultCameraTarget;
    }

    const direction = new Vector3()
      .subVectors(targetVector, camera.position)
      .normalize();

    targetNode.current = targetVector.clone().add(direction.multiplyScalar(-5));

    // const targetPosition = targetNode.current.clone().add(new Vector3(0, 0, 5));
    setIsAnimating(true);
    setCameraTarget(targetVector);
    animationStartTime.current = performance.now();
  };

  useFrame(() => {
    if (isAnimating && targetNode.current && animationStartTime.current) {
      const elapsedTime = performance.now() - animationStartTime.current;
      const t = elapsedTime / animationDuration;

      if (t < 1) {
        camera.position.lerp(targetNode.current, t);
        if (selectedNode !== -1) {
          const node = data.nodes.filter(
            (node: any) => node.uuId === selectedNode
          )[0];

          const nodePosition = new Vector3(
            node.position.x,
            node.position.y,
            node.position.z
          );

          const lookAtTarget = nodePosition;
          camera.lookAt(lookAtTarget);
        }
      } else {
        camera.position.lerp(targetNode.current, t);
        if (selectedNode !== -1) {
          const node = data.nodes.filter(
            (node: any) => node.uuId === selectedNode
          )[0];

          const nodePosition = new Vector3(
            node.position.x,
            node.position.y,
            node.position.z
          );

          const lookAtTarget = nodePosition;
          camera.lookAt(lookAtTarget);
        }
        setIsAnimating(false);
        animationStartTime.current = null;
      }
    }
  });

  useEffect(() => {
    handleNodeSelection(selectedNode);
  }, [selectedNode]);

  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <OrbitControls
        target={cameraTarget ? cameraTarget : defaultCameraTarget}
      />
      <group>
        {data && data.nodes
          ? data.nodes.map((node: any) => {
              return (
                <Node
                  key={node.uuId}
                  position={
                    new Vector3(
                      node.position.x,
                      node.position.y,
                      node.position.z
                    )
                  }
                  data={{
                    name: node.name,
                    uuId: node.uuID,
                  }}
                  color="blue"
                  onClick={() => handleNodeClick(node.uuId)}
                />
              );
            })
          : ""}
        {data && data.edges
          ? data.edges.map((edge: any, index: number) => {
              const from = data.nodes[edge.fromIndex].position;
              const to = data.nodes[edge.toIndex].position;
              return (
                <Edge
                  key={index}
                  start={new Vector3(from.x, from.y, from.z)}
                  end={new Vector3(to.x, to.y, to.z)}
                  color="black"
                />
              );
            })
          : ""}
      </group>
    </>
  );
};

export default GraphScene;
