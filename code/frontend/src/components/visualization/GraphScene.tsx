import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";
import THREE, { Mesh } from "three";
import axios from "axios";
// create function componentt

interface GraphSceneProps {
  data: any;
}

const GraphScene: React.FC<GraphSceneProps> = ({ data }) => {
  const nodesRef = useRef<THREE.Mesh[]>([]);

  useFrame(() => {
    nodesRef.current.forEach((node, i) => {
      if (data) {
        const { x, y, z } = data.nodes[i].position;
        node.position.set(x, y, z);
      }
    });
  });

  return (
    <>
      <OrbitControls />
      <group>
        {data.nodes.map((node: any, index: number) => (
          <mesh
            key={node.uuId}
            ref={(mesh) => (nodesRef.current[index] = mesh as any)}
          >
            <sphereBufferGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="orange" />
          </mesh>
        ))}

        {/* {data.edges.map((edge, index) => (
        <line key={i}>
          <bufferGeometry
            attach="geometry"
            vertices={[
              new THREE.Vector3(data.nodes.find(node => node.uuId === link.source)!.x, data.nodes.find(node => node.uuId === link.source)!.y, 0),
              new THREE.Vector3(data.nodes.find(node => node.uuId === link.target)!.x, data.nodes.find(node => node.uuId === link.target)!.y, 0),
            ]}
          />
          <lineBasicMaterial color="white" />
        </line>
      ))} */}
      </group>
    </>
  );
};

export default GraphScene;
