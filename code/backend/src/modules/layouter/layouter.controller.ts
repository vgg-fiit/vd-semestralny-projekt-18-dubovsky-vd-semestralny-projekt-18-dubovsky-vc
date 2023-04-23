import { type Request } from 'express';
import { type AppResponse } from '../../shared/interfaces/response.interface';
import { DatabaseService } from '../../shared/services/database.service';
import { Edge, Node, type Graph, Vector3 } from '../graph/interfaces/graph.interface';
import { LayouterMock } from './mocks/layouter.mock';
import { LoggerService } from '../../shared/services/logger.service';
import { it } from 'node:test';

export class LayouterController {

	public static setRandomPositions(graph: Graph) {
		graph.nodes.forEach(node => {
			node.position = new Vector3(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10);
		});
	}

	public static insertIntoGraph(graph: Graph, entry: any) {
		if (graph.mapping[entry.id] == undefined) {
			graph.nodes.push(new Node(entry.properties.name, entry.id, 1, entry.labels[0]));
			graph.mapping[entry.id] = graph.nodes.length - 1; 
		}
	}

	public static insertRelationshipIntoGraph(graph: Graph, entry: [], existingEdges: {}) {
		const getId = (id: any, id2: any) => id + "-" + id2;
		entry.forEach((item: any) => {
			if (!existingEdges[getId(item.start.low, item.end.low)] && !existingEdges[getId(item.end.low, item.start.low)]) {
				graph.edges.push(new Edge(graph.mapping[item.start.low], graph.mapping[item.end.low], item.start.low, item.end.low, true));
				existingEdges[getId(item.start.low, item.end.low)] = true;
			}
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
		const existingEdges = {};
		const getId = (id: any, id2: any) => id + "-" + id2;
		data.forEach((entry: any) => {
			if (entry.n && entry.m && entry.n.id == entry.m.id) {
				return;
			}
			if (graph.mapping[entry.n.id] == undefined) {
				LayouterController.insertIntoGraph(graph, entry.n);
				if (graph.mapping[entry.m.id] == undefined) {
					LayouterController.insertIntoGraph(graph, entry.m);
				}
				if (!existingEdges[getId(entry.m.id, entry.n.id)] && !existingEdges[getId(entry.n.id, entry.m.id)]) {
					graph.edges.push(new Edge(graph.mapping[entry.n.id], graph.mapping[entry.m.id], entry.n.id, entry.m.id));
					LoggerService.printToFile({insertedEdge: {from: entry.n.id, to: entry.m.id}})
					existingEdges[getId(entry.n.id, entry.m.id)] = true;
				}
				LayouterController.insertRelationshipIntoGraph(graph, entry.r, existingEdges);
			} else {
				LayouterController.insertIntoGraph(graph, entry.n);
				if (graph.mapping[entry.m.id] == undefined) {
					LayouterController.insertIntoGraph(graph, entry.m);
				}
				const filtered: any[] = entry.r.filter((item: any) => item.start.low == entry.m.id)
				if (filtered.length > 0) {
					filtered.forEach((item: any) => {
						if (!existingEdges[getId(item.start.low, item.end.low)] && !existingEdges[getId(item.end.low, item.start.low)]) {
							graph.edges.push(new Edge(graph.mapping[item.start.low], graph.mapping[item.end.low], item.start.low, item.end.low, true));
							LoggerService.printToFile({insertedEdge: {from: item.start.low, to: item.end.low}})
							existingEdges[getId(item.start.low, item.end.low)] = true;
						}
					});
				} else {
					if (!existingEdges[getId(entry.m.id, entry.n.id)] && !existingEdges[getId(entry.n.id, entry.m.id)]) {
						graph.edges.push(new Edge(graph.mapping[entry.n.id], graph.mapping[entry.m.id], entry.n.id, entry.m.id));
						LoggerService.printToFile({insertedEdge: {from: entry.n.id, to: entry.m.id}})
						existingEdges[getId(entry.n.id, entry.m.id)] = true;
					}
				}
			}
		});
		graph.nodesCount = graph.nodes.length;
		graph.edgesCount = graph.edges.length;
		return graph;
	}

	static calculateRepulsiveForces(graph: Graph, k: number) {
		graph.nodes.forEach((from) =>
			graph.nodes.forEach((to) => {
				from.constantDisplacement = 0;
				if (from.uuId === to.uuId) return;
				from.displacement.subtractBy(from.repulse(to, k));
			}),
		);
	}

	static calculateAttractiveForces(graph: Graph, k: number) {
		graph.edges.forEach((edge) => {
			const fromNode = graph.nodes[edge.fromIndex];
			const toNode = graph.nodes[edge.toIndex];

			const force = fromNode.attract(toNode, k);
			fromNode.displacement.subtractBy(force);
			toNode.displacement.add(force);
		});
	}

	static updateNodePositions(graph: Graph, temperature: number) {
		graph.nodes.forEach((node) => {
			if (!node.fixed) {
				const displacementMagnitude = node.displacement.getMagnitude();
				const movement = Math.min(displacementMagnitude, temperature);
				node.displacement.normalize();
				node.displacement.multiplyBy(movement);
				node.position.add(node.displacement);
			}
		});
	}


	static run(graph: Graph): void {
		const k = Math.sqrt((200 * 200) / graph.nodesCount);
		let temperature = 100;
		const initTemp = temperature;
	
		for (let i = 0; temperature > 0.05; i++) {
			LayouterController.calculateRepulsiveForces(graph, k);
			LayouterController.calculateAttractiveForces(graph, k);
			LayouterController.updateNodePositions(graph, temperature);
			temperature = initTemp / Math.pow(Math.E, i / 1500);
		}
	}

	static normalizePositions(graph: Graph): void {
		const positionX = graph.nodes.map(node => node.position.x)
		const positionY = graph.nodes.map(node => node.position.y)
		const positionZ = graph.nodes.map(node => node.position.z)
		const maxX = Math.max(...positionX);
		const minX = Math.min(...positionX);
		const maxY = Math.max(...positionY);
		const minY = Math.min(...positionY);
		const maxZ = Math.max(...positionZ);
		const minZ = Math.min(...positionZ);
		graph.nodes.forEach(node => {
			if (!node.fixed) {
				node.position.x = (node.position.x - minX) / (maxX - minX) * 10 - 5;
				node.position.y = (node.position.y - minY) / (maxY - minY) * 10 - 5;
				node.position.z = (node.position.z - minZ) / (maxZ - minZ) * 10 - 5;
			}
		})
	}

	public static setFixedPosition(id: string, graph: Graph): void {
		const fixedNode: Node = graph.nodes.find(node => node.name == id) as Node
		fixedNode.fixed = true;
		fixedNode.position = new Vector3(0, 0, 0);
	}
	
    public static async layoutGraph(req: Request): Promise<AppResponse<Graph>> {
		const data = await DatabaseService.build(req).run();
		//const graph = LayouterMock.getMock();
		const graph = LayouterController.dataToGraph(data);
		//LayouterController.setFixedPosition("root", graph);
		LayouterController.setRandomPositions(graph);
		LayouterController.run(graph);
		LayouterController.normalizePositions(graph);
		return {data: graph} as AppResponse<Graph>;
	}
}
