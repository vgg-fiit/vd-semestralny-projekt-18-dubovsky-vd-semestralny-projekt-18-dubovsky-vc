import { type Request } from 'express';
import { type AppResponse } from '../../shared/interfaces/response.interface';
import { Edge, LayoutedGraph, type Graph, type Node, type vector3 } from '../graph/interfaces/graph.interface';
import { LayouterMock } from './mocks/layouter.mock';

export class LayouterController {

    private static calculateRepulsiveForces(graph: Graph) {
		const k: number = graph.nodes.length > 1000 ? 1000 / graph.nodes.length : 1;
        const repulsiveForce = (force: number) => (Math.round(force / force) * Math.pow(k, 2));
        graph.nodes.forEach((nodeFrom) => {
			nodeFrom.constantDisplacement = 0;
			graph.nodes.forEach((nodeTo) => {
				if (nodeFrom == nodeTo) return;
				nodeFrom.displaceNodeBy(nodeTo, repulsiveForce);
			});
		});
    }

	private static calculateAttractiveForces(graph: Graph) {
		const k: number = graph.nodes.length > 1000 ? 1000 / graph.nodes.length : 1;
		const attractiveForce = (force: number, negative?: boolean) =>
			((negative ? -1 : 1) * Math.pow(k, 2) * Math.round(force / force));
		graph.edges.forEach((edge: Edge) => {
			const nodeFrom: Node = graph.nodes[edge.fromIndex];
			const nodeTo: Node = graph.nodes[edge.toIndex];
			nodeFrom.displaceNodeBy(nodeTo, attractiveForce);
			nodeTo.displaceNodeBy(nodeFrom, attractiveForce);
		});
	}

	private static updatePosition(graph: LayoutedGraph) {
		graph.nodes.forEach((node: Node) => {
			node.position = {
				x: node.position.x + Math.floor(node.displacement.x / node.displacement.x) * Math.min(node.displacement.x, graph.temperature),
				y: node.position.y + Math.floor(node.displacement.y / node.displacement.y) * Math.min(node.displacement.y, graph.temperature),
				z: node.position.z + Math.floor(node.displacement.z / node.displacement.z) * Math.min(node.displacement.z, graph.temperature)
			}
		})
		//graph.temperature -= 0.0
	}

    public static layoutGraph(req: Request): AppResponse<Graph> {
		// fetch graph with options
        // <<neo3j request here>>
		const graph: Graph = LayouterMock.getMock();

        // eslint-disable-next-line no-constant-condition
        // while (true) {
			LayouterController.calculateRepulsiveForces(graph);
			LayouterController.calculateAttractiveForces(graph);
			LayouterController.updatePosition(graph as LayoutedGraph);
		//}

        return {} as AppResponse<Graph>;
    }
}
