export interface Graph {
    nodes: Node[];
    edges: Edge[];
}

export interface LayoutedGraph extends Graph {
    temperature: number;
}

export interface vector3 {
    x: number;
    y: number;
    z: number;
}

export class Node {
    uuId: number;
    size: number;
    position: vector3;
    displacement: vector3;
    name: string;

    constructor(name: string, nodeId: number, size: number, position?: vector3, displacement?: vector3) {
		this.name = name;
		this.uuId = nodeId;
		this.size = size;
		if (position != null) {
			this.position = position;
		}
		if (displacement != null) {
			this.displacement = displacement;
		}
    }

    set constantDisplacement(displacement: number) {
		this.displacement = { x: displacement, y: displacement, z: displacement };
	}

    public getDistanceTo(nodeTo: Node): vector3 {
        return {
            x: this.displacement.x - nodeTo.displacement.x,
            y: this.displacement.y - nodeTo.displacement.y,
			z: this.displacement.z - nodeTo.displacement.z,
        };
    }

    displaceNodeBy(nodeTo: Node, force: (v: number) => number) {
		const distance: vector3 = this.getDistanceTo(nodeTo);
		this.displacement = {
			x: (this.displacement.x += force(distance.x)),
			y: (this.displacement.y += force(distance.y)),
			z: (this.displacement.z += force(distance.z)),
        };
    }
}

export class Edge {
    fromIndex: number;
    toIndex: number;

    constructor(fromId: number, toId: number) {
		this.fromIndex = fromId;
		this.toIndex = toId;
	}
}
