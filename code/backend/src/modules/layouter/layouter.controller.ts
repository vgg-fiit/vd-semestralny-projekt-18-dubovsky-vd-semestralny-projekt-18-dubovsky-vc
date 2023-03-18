import { type Request } from 'express';
import { type AppResponse } from '../../shared/interfaces/response.interface';
import { Edge, type Graph, type Node, type vector3 } from '../graph/interfaces/graph.interface';
import { LayouterMock } from './mocks/layouter.mock';
import { LoggerService } from '../../shared/services/logger.service';

export class LayouterController {

	static graph: Graph = LayouterMock.getMock();

    private static calculateRepulsiveForces(graph: Graph) {
		const k: number = graph.nodes.length > 1000 ? 1000 / graph.nodes.length : 1;
        const repulsiveForce = (force: number) => (Math.round(force / Math.abs(force)) * (Math.pow(force, 2) / k));
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
			((negative ? -1 : 1) * Math.round(force / Math.abs(force)) * (Math.pow(k, 2) / force));
		graph.edges.forEach((edge: Edge) => {
			const nodeFrom: Node = graph.nodes[edge.fromIndex];
			const nodeTo: Node = graph.nodes[edge.toIndex];
			nodeFrom.displaceNodeBy(nodeTo, attractiveForce);
			nodeTo.displaceNodeBy(nodeFrom, attractiveForce);
		});
	}

	private static updatePosition(graph: Graph, temperature: number) {
		graph.nodes.forEach((node: Node) => {
			node.position = {
				x: node.position.x + Math.floor(node.displacement.x / node.displacement.x) * Math.min(node.displacement.x, temperature),
				y: node.position.y + Math.floor(node.displacement.y / node.displacement.y) * Math.min(node.displacement.y, temperature),
				z: node.position.z + Math.floor(node.displacement.z / node.displacement.z) * Math.min(node.displacement.z, temperature)
			}
		})
	}

	public static setRandomPositions(graph: Graph) {
		graph.nodes.forEach(node => {
			node.position = {x: Math.random(), y: Math.random(), z: Math.random()}
		})
	}

    public static layoutGraph(req: Request): AppResponse<Graph> {
		// fetch graph with options
        // <<neo3j request here>>
		let initTemp: number = 4, actualTemp: number = 4, whichTry: number = 0;
		while(actualTemp > 0.05) {
			LayouterController.calculateRepulsiveForces(LayouterController.graph);
			LayouterController.calculateAttractiveForces(LayouterController.graph);
			LayouterController.updatePosition(LayouterController.graph, actualTemp);
			actualTemp = initTemp / Math.pow(Math.E, whichTry / 15);
			whichTry++;
		}
		return {data: LayouterController.graph} as AppResponse<Graph>;
	}
}
