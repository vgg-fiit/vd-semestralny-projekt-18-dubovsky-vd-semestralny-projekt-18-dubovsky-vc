export interface Graph {
	nodes: Node[],
    edges: Edge[]
}

type vector3 = [number, number, number]

export interface Node {
    nodeId: number,
    size: number,
    position: vector3
}

export interface Edge {
    fromId: number,
    toId: number
}