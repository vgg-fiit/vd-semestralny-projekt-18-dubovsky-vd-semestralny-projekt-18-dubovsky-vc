import { type Request } from 'express';
import { Keywords, NodeType } from '../../shared/interfaces/database.interface';
import { type AppResponse } from '../../shared/interfaces/response.interface';
import { DatabaseService } from '../../shared/services/database.service';
import { Edge, Node, type Graph } from '../graph/interfaces/graph.interface';
import { LayouterMock } from './mocks/layouter.mock';

export class LayouterController {

	static graph: Graph = LayouterMock.getMock();

    private static calculateRepulsiveForces(graph: Graph) {
		const k: number = graph.nodes.length > 100 ? 100 / graph.nodes.length : 1;
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
		const k: number = graph.nodes.length > 100 ? 100 / graph.nodes.length : 1;
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

	public static insertIntoGraph(graph: Graph, entry: any) {
		if (graph.mapping[entry.id] == undefined) {
			graph.nodes.push(new Node(entry.properties.name, entry.id, 1));
			graph.mapping[entry.id] = graph.nodes.length - 1; 
		}
	}

	public static insertRelationshipIntoGraph(graph: Graph, entry: []) {
		entry.forEach((item: any) => {
			graph.edges.push(new Edge(graph.mapping[item.start.low], graph.mapping[item.end.low], item.start.low, item.end.low));
		})
	}

	public static dataToGraph(data: any): Graph {
		const graph: Graph = {
			nodes: [],
			edges: [],
			mapping: {},
			nodesCount: 0,
			edgesCount: 0
		};
		data.forEach((entry: any) => {
			if (entry.n && entry.m && entry.n.id == entry.m.id) return;
			LayouterController.insertIntoGraph(graph, entry.n);
			if (entry.m) {
				LayouterController.insertIntoGraph(graph, entry.m);
				graph.edges.push(new Edge(graph.mapping[entry.n.id], graph.mapping[entry.m.id], entry.n.id, entry.m.id));	
			}
			if (entry.r) {
				LayouterController.insertRelationshipIntoGraph(graph, entry.r);
			}
		});
		graph.nodesCount = graph.nodes.length;
		graph.edgesCount = graph.edges.length;
		return graph;
	}

    public static async layoutGraph(req: Request): Promise<AppResponse<Graph>> {
		const data = await DatabaseService.build(req).run();
		const graph = LayouterController.dataToGraph(data);
		LayouterController.setRandomPositions(graph);
		const initTemp = 4;
		let actualTemp = 4, whichTry = 0;
		while(actualTemp > 0.05) {
			LayouterController.calculateRepulsiveForces(LayouterController.graph);
			LayouterController.calculateAttractiveForces(LayouterController.graph);
			LayouterController.updatePosition(LayouterController.graph, actualTemp);
			actualTemp = initTemp / Math.pow(Math.E, whichTry / 150);
			whichTry++;
		}
		graph.nodes.forEach(n => n.position = {x: n.position.x * 10, y: n.position.y * 10, z: n.position.z * 10})
		return {data: graph} as AppResponse<Graph>;
	}
}
