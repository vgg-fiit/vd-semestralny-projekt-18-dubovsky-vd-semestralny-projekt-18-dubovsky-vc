import { NodeType } from "../../../shared/interfaces/database.interface";
import { HistogramItem } from "./histogram.interface";

export interface Graph {
    histogram?: HistogramItem[];
    nodes: Node[];
    edges: Edge[];
    mapping: { [id: number]: number };
    nodesCount: number;
    edgesCount: number;
}

export class Vector3 {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v: Vector3): void {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }

    subtractBy(v: Vector3): Vector3 {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    multiplyBy(scalar: number): void {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
    }

    getMagnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize(): void {
        const magnitude = this.getMagnitude();
        if (magnitude === 0) return;
        this.x /= magnitude;
        this.y /= magnitude;
        this.z /= magnitude;
    }
}

export class Node {
    uuId: number;
    size: number;
    position: Vector3;
    displacement: Vector3;
    name: string;
    type: NodeType;
    fixed: boolean;

    constructor(name: string, nodeId: number, size: number, type?: NodeType, position?: Vector3, displacement?: Vector3) {
		this.name = name;
		this.uuId = nodeId;
		this.size = size;
        if (type != null) {
            this.type = type;
        }
		if (position != null) {
			this.position = position;
		}
		if (displacement != null) {
			this.displacement = displacement;
		} else {
            this.displacement = new Vector3(0, 0, 0);
        }
    }

    set constantDisplacement(displacement: number) {
        this.displacement = new Vector3(displacement, displacement, displacement);
    }
    
    repulse(n: Node, k: number): Vector3 {
        const distance = this.position.subtractBy(n.position);
        const normalized = distance.getMagnitude();
        const minDistance = (this.size + n.size) / 2;
        const adjustedDistance = Math.max(normalized, minDistance);
        const force = (k * k) / adjustedDistance;

        if (normalized > 0) {
            distance.normalize();
        }
        distance.multiplyBy(force);
        return distance;
    }

    attract(n: Node, k: number): Vector3 {
        const distance = this.position.subtractBy(n.position);
        const normalized = distance.getMagnitude();
        const sizeFactor = (this.size + n.size) / 2;
        const force = (normalized * normalized) / (k * sizeFactor);

        if (normalized > 0) {
            distance.normalize();
        }
        distance.multiplyBy(force);
        return distance;
    }

    
}

export class Edge {
    fromIndex: number;
    toIndex: number;
    fromId: number;
    toId: number;

    constructor(fromIndex: number, toIndex: number, fromId?: number, toId?: number, rel?: boolean) {
		this.fromIndex = fromIndex;
		this.toIndex = toIndex;
        this.toId = toId ? toId : toIndex;
        this.fromId = fromId ? fromId : fromIndex;
	}
}
