import React, { useState, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
// create function componentt
import { Node, Edge } from "./Graph";

interface GraphSceneProps {
  data: any;
  handleNodeSelection: (selected: any) => void;
  handleHoveredNode: (hovered: any) => void;
  colors: {
    nodeColor: string;
    edgeColor: string;
    selectedNodeColor: string;
  };
}

const GraphScene: React.FC<GraphSceneProps> = ({
  data,
  handleNodeSelection,
  handleHoveredNode,
  colors,
}) => {
  const [selectedNodes, setSelectedNodes] = useState<number[]>([]);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  const handleNodeClick = (index: number) => {
    setSelectedNodes((prevSelectedNodes) => {
      if (prevSelectedNodes.includes(index)) {
        // Deselect the node by removing its index from the selectedNodes array
        return prevSelectedNodes.filter((i) => i !== index);
      } else {
        // Select the node by adding its index to the selectedNodes array
        return [...prevSelectedNodes, index];
      }
    });
  };

  const handleNodeHover = (node: Node) => {
    handleHoveredNode(node);
  };

  useEffect(() => {
    handleNodeSelection(selectedNodes);
    handleHoveredNode(hoveredNode);
  }, [selectedNodes]);

  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls target={[0, 0, 0]} />
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
                  color={colors.nodeColor}
                  selectedColor={colors.selectedNodeColor}
                  onClick={() => handleNodeClick(node.uuId)}
                  onHover={() => handleNodeHover(node)}
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
                  color={colors.edgeColor}
                />
              );
            })
          : ""}
      </group>
    </>
  );
};

export default GraphScene;
