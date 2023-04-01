import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
import axios from "axios";
// create function componentt
import { Node, Edge } from "./Graph";

interface GraphSceneProps {
  data: any;
}

const GraphScene: React.FC<GraphSceneProps> = ({ data }) => {
  return (
    <>
      <OrbitControls />
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
                  color="blue"
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
