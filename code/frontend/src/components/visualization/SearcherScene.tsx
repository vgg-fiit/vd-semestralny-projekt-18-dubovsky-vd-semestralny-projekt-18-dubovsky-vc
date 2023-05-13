import React, { useState, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";
// create function componentt
import { Node, Edge } from "./Graph";
import { index } from "d3";
import { Container } from "@mui/material";
import { hover } from "@testing-library/user-event/dist/hover";

interface SearcherScene {
  data: any;
  handleNodeSelection: (selected: any) => void;
  handleHoveredNode: (hovered: any) => void;
  highlightPhrase?: string;
  highlightNodes?: any;
  colors: {
    nodeColor: string;
    edgeColor: string;
    selectedNodeColor: string;
  };
}

const SearcherScene: React.FC<SearcherScene> = ({
  data,
  handleNodeSelection,
  handleHoveredNode,
  highlightPhrase = "",
  highlightNodes = [],
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

  useEffect(() => {
    if (highlightNodes) {
      setSelectedNodes(highlightNodes.map((item: any) => item.uuId));
      console.log(highlightNodes);
    } else setSelectedNodes([]);
  }, [highlightNodes]);

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
                  staticData={node.name}
                  hoverData={node.keywords}
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
                  onHover={() => {
                    handleNodeHover(node);
                  }}
                  isSelected={selectedNodes.includes(node.uuId)}
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

export default SearcherScene;
