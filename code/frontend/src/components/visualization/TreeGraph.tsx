import * as React from "react";
import { Container } from "@mui/material";
import { Group } from '@visx/group';
import { Tree } from '@visx/hierarchy';
import { LinkVertical } from '@visx/shape';
import { hierarchy } from 'd3-hierarchy';
import { LinearGradient } from '@visx/gradient';
import { Tooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
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

    return (
        <Container>
            <svg width={width} height={height}>
                <rect width={width} height={height} fill="#1976d2" />
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
                            {tree.descendants().map((node, _) => {
                                const [isHovered, setIsHovered] = React.useState(false);
                                return (
                                    <Group
                                        top={node.y}
                                        left={node.x}
                                        onMouseEnter={() => setIsHovered(true)}
                                        onMouseLeave={() => setIsHovered(false)}
                                    >
                                        {isHovered && (
                                            <circle
                                                r={25}
                                                fill="#ffffff"
                                                stroke="#9c27b0"
                                                strokeWidth={2}
                                            />
                                        )}
                                        {!isHovered && (
                                            <circle
                                                r={15}
                                                fill="#ffffff"
                                                stroke="#374469"
                                                strokeWidth={2}
                                            />
                                        )}
                                        {isHovered && (
                                            <text
                                                dy="-40px"
                                                fontSize={12}
                                                fontWeight="bold"
                                                fontFamily="Arial"
                                                textAnchor="middle"
                                                fill="white"
                                            >
                                                {node.data.name}
                                            </text>
                                        )}
                                        {isHovered && (
                                            <text
                                                dy=".33em"
                                                fontSize={9}
                                                fontFamily="Arial"
                                                fontWeight="bold"
                                                textAnchor="middle"
                                                fill="#9c27b0"
                                            >
                                                {node.data.uuId}
                                            </text>
                                        )
                                        }
                                        {!isHovered && (
                                            <text
                                                dy=".33em"
                                                fontSize={9}
                                                fontFamily="Arial"
                                                textAnchor="middle"
                                                fill="#9c27b0"
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
