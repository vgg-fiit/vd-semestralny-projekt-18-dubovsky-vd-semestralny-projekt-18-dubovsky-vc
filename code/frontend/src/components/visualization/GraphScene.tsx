import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";
import { Mesh } from "three";
import * as three from "three";
import axios from "axios";
// create function componentt

interface GraphSceneProps {
  data: any;
}

const GraphScene: React.FC<GraphSceneProps> = ({ data }) => {
  const nodesRef = useRef<three.Mesh[]>([]);

  useFrame(() => {
    nodesRef.current.forEach((node, i) => {
      if (data && data.nodes && data.edges) {
        const { x, y, z } = data.nodes[i].position;
        node.position.set(x, y, z);
      }
    });
  });
  
  return (
    <>
      <OrbitControls />
      <group>
        {data && data.nodes ? data.nodes.map((node: any, index: number) => (
          <mesh
            key={node.uuId}
            ref={(mesh) => {(nodesRef.current[index] = mesh as any)}}
          >
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="orange" />
          </mesh>
        )): "Loading"}

      {data && data.edges && data.nodes ? data.edges.map((edge: any, index: number) => (
        <line key={index}>
          <bufferGeometry
            onUpdate={(geometry) => {
              geometry.setFromPoints([
                new three.Vector3(data.nodes[edge.fromIndex].position.x, data.nodes[edge.fromIndex].position.y, data.nodes[edge.fromIndex].position.z),
                new three.Vector3(data.nodes[edge.toIndex].position.x, data.nodes[edge.toIndex].position.y, data.nodes[edge.toIndex].position.z)
              ]);
            }}
          />
          <lineBasicMaterial color="black" />
        </line>
      )): "Loading"}
      </group>
    </>
  );
};

export default GraphScene;
