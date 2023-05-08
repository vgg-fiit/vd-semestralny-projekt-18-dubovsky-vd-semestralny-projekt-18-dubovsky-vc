import * as React from "react";
import { Container } from "@mui/material";
import { Group } from '@visx/group';
import { Tree } from '@visx/hierarchy';
import { LinkVertical } from '@visx/shape';
import { hierarchy } from 'd3-hierarchy';
import { HierarchyPointNode } from "@visx/hierarchy/lib/types";

export interface GraphTreeData {
    name: string;
    uuId: number;
    children: GraphTreeData[];
}

export interface TreeGraphProps {
    tree: GraphTreeData;
}

const TreeGraph: React.FC<TreeGraphProps> = ({ tree }) => {
    const root = hierarchy(tree);
    const width = 1150;
    const height = 400;
    const [hoveredNode, setHoveredNode] = React.useState<Number | null>(null);

    return (
        <Container>
            <svg width={width} height={height}>
                <rect width={width} height={height} fill="white" />
                <Tree<GraphTreeData> root={root} size={[width - 100, height - 100]}>
                    {(tree) => (
                        <Group top={50} left={50}>
                            {tree.links().map((link, _) => (
                                <LinkVertical
                                    data={link}
                                    stroke="#374469"
                                    strokeWidth="1"
                                    fill="none"
                                />
                            ))}
                            {tree.descendants().map((node, i) => {
                                return (
                                    <Group
                                        top={node.y}
                                        left={node.x}
                                        onMouseEnter={() => setHoveredNode(i)}
                                        onMouseLeave={() => setHoveredNode(null)}
                                    >
                                        {hoveredNode == i && (
                                            <circle
                                                r={25}
                                                fill="#1976d2"
                                                stroke="#9c27b0"
                                                strokeWidth={2}
                                            />
                                        )}
                                        {hoveredNode != i && (
                                            <circle
                                                r={15}
                                                fill="#1976d2"
                                                stroke="#374469"
                                                strokeWidth={2}
                                            />
                                        )}
                                        {hoveredNode == i && (
                                            <text
                                                dy="-40px"
                                                fontSize={13}
                                                fontWeight="bold"
                                                fontFamily="Arial"
                                                textAnchor="middle"
                                                fill="black"
                                            >
                                                {node.data.name}
                                            </text>
                                        )}
                                        {hoveredNode == i && (
                                            <text
                                                dy=".33em"
                                                fontSize={9}
                                                fontFamily="Arial"
                                                fontWeight="bold"
                                                textAnchor="middle"
                                                fill="white"
                                            >
                                                {node.data.uuId}
                                            </text>
                                        )
                                        }
                                        {hoveredNode != i && (
                                            <text
                                                dy=".33em"
                                                fontSize={9}
                                                fontFamily="Arial"
                                                textAnchor="middle"
                                                fill="white"
                                            >
                                                {node.data.uuId}
                                            </text>
                                        )
                                        }
                                    </Group>
                                );
                            })}
                        </Group>
                    )}
                </Tree>
            </svg>
        </Container>
    );
};

export default TreeGraph;
