export interface Graph {
    nodes: Node[];
    edges: Edge[];
    mapping: { [id: number]: number };
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
		} else {
            this.displacement = {x: 0, y: 0, z: 0}
        }
    }

    set constantDisplacement(displacement: number) {
		this.displacement = { x: displacement, y: displacement, z: displacement };
	}

    public getDistanceTo(nodeTo: Node): vector3 {
        return {
            x: this.position.x - nodeTo.position.x,
            y: this.position.y - nodeTo.position.y,
			z: this.position.z - nodeTo.position.z,
        };
    }

    public getNormalizedDistanceTo(nodeTo: Node): vector3 {
        const distance: vector3 = this.getDistanceTo(nodeTo);
        const vectorLength: number = Math.sqrt(distance.x * distance.x + distance.y * distance.y + distance.z * distance.z);
        if (vectorLength == 0)
            return {x: 0, y: 0, z: 0};
        return {x: distance.x / vectorLength, y: distance.y / vectorLength, z: distance.z / vectorLength};
    }

    displaceNodeBy(nodeTo: Node, force: (v: number) => number) {
		const distance: vector3 = this.getNormalizedDistanceTo(nodeTo);
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
    fromId: number;
    toId: number;

    constructor(fromIndex: number, toIndex: number, fromId: number, toId: number) {
		this.fromIndex = fromIndex;
		this.toIndex = toIndex;
        this.toId = toId;
        this.fromId = fromId;
	}
}
