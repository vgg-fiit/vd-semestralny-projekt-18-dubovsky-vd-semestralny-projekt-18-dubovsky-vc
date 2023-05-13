import { type Request } from 'express';
import { type AppResponse } from '../../shared/interfaces/response.interface';
import { DatabaseService } from '../../shared/services/database.service';
import { Edge, Node, File, type Graph, Vector3, Tree, Bucket } from '../graph/interfaces/graph.interface';
import { LoggerService } from '../../shared/services/logger.service';
import { HistogramItem } from '../graph/interfaces/histogram.interface';

export class LayouterController {

	public static setRandomPositions(graph: Graph) {
		graph.nodes.forEach(node => {
			node.position = new Vector3(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10);
		});
	}

	public static insertIntoGraph(graph: Graph, entry: any) {
		if (graph.mapping[entry.id] == undefined) {
			graph.nodes.push(new Node(entry.properties.name, entry.id, 1, entry.properties.keywords, entry.labels[0]));
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
				/*if (!existingEdges[getId(entry.m.id, entry.n.id)] && !existingEdges[getId(entry.n.id, entry.m.id)]) {
					graph.edges.push(new Edge(graph.mapping[entry.n.id], graph.mapping[entry.m.id], entry.n.id, entry.m.id));
					existingEdges[getId(entry.n.id, entry.m.id)] = true;
				}
				LayouterController.insertRelationshipIntoGraph(graph, entry.r, existingEdges);*/
			} else {
				LayouterController.insertIntoGraph(graph, entry.n);
				if (graph.mapping[entry.m.id] == undefined) {
					LayouterController.insertIntoGraph(graph, entry.m);
				}
				/*const filtered: any[] = entry.r.filter((item: any) => item.start.low == entry.m.id)
				if (filtered.length > 0) {
					filtered.forEach((item: any) => {
						if (!existingEdges[getId(item.start.low, item.end.low)] && !existingEdges[getId(item.end.low, item.start.low)]) {
							graph.edges.push(new Edge(graph.mapping[item.start.low], graph.mapping[item.end.low], item.start.low, item.end.low, true));
							existingEdges[getId(item.start.low, item.end.low)] = true;
						}
					});
				} else {
					if (!existingEdges[getId(entry.m.id, entry.n.id)] && !existingEdges[getId(entry.n.id, entry.m.id)]) {
						graph.edges.push(new Edge(graph.mapping[entry.n.id], graph.mapping[entry.m.id], entry.n.id, entry.m.id));
						existingEdges[getId(entry.n.id, entry.m.id)] = true;
					}
				}*/
			}
		});
		data.forEach((entry: any) => {
			if (entry.n && entry.m && entry.n.id == entry.m.id) {
				return;
			}
			if (graph.mapping[entry.n.id] == undefined) {
				if (!existingEdges[getId(entry.m.id, entry.n.id)] && !existingEdges[getId(entry.n.id, entry.m.id)] && graph.mapping[entry.m.id] != undefined && graph.mapping[entry.n.id] != undefined) {
					graph.edges.push(new Edge(graph.mapping[entry.n.id], graph.mapping[entry.m.id], entry.n.id, entry.m.id));
					existingEdges[getId(entry.n.id, entry.m.id)] = true;
				}
				LayouterController.insertRelationshipIntoGraph(graph, entry.r, existingEdges);
			} else {
				const filtered: any[] = entry.r.filter((item: any) => item.start.low == entry.m.id)
				if (filtered.length > 0) {
					filtered.forEach((item: any) => {
						if (!existingEdges[getId(item.start.low, item.end.low)] && !existingEdges[getId(item.end.low, item.start.low)] && graph.mapping[item.start.low] != undefined && graph.mapping[item.end.low] != undefined) {
							graph.edges.push(new Edge(graph.mapping[item.start.low], graph.mapping[item.end.low], item.start.low, item.end.low, true));
							existingEdges[getId(item.start.low, item.end.low)] = true;
						}
					});
				} else {
					if (!existingEdges[getId(entry.m.id, entry.n.id)] && !existingEdges[getId(entry.n.id, entry.m.id)] && graph.mapping[entry.m.id] != undefined && graph.mapping[entry.n.id] != undefined) {
						graph.edges.push(new Edge(graph.mapping[entry.n.id], graph.mapping[entry.m.id], entry.n.id, entry.m.id));
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

	public static formatHistogram(data: {}[]): HistogramItem[] {
		const histogramItems: HistogramItem[] = [];
		data.forEach((item: any) => {
			histogramItems.push({text: item.word, value: item.aggregatedWordCount.low})
		})
		return histogramItems;
	}

	public static formatAsTree(graph: Graph): Tree {
		graph.edges.forEach(e => {
			if (e.fromId > e.toId) {
				const temp = e.fromId;
				e.fromId = e.toId;
				e.toId = temp;
				const tempIndex = e.fromIndex;
				e.fromIndex = e.toIndex;
				e.toIndex = tempIndex;
			}
		})
		graph.edges.sort((e, f) => e.fromId - f.fromId )
		const map: Map<number, Tree> = new Map();
		graph.nodes.forEach(node => {
			map.set(node.uuId, {name: node.name, uuId: node.uuId, children: []});
		});
		graph.edges.forEach(edge => {
			const parent = map.get(edge.fromId);
			const child = map.get(edge.toId);
			(parent as Tree).children.push(child as Tree);
		});
		if (map.get(graph.nodes[0].uuId)?.children.length === 0) {
			return map.get(graph.edges[0].fromId) as Tree;
		}
		return map.get(graph.nodes[0].uuId) as Tree;
	}

	public static formatToFile(data: {}[]): File[] {
		const files: File[] = [];
		data.forEach((item: any, index: number) => {
			files.push({name: item.n.properties.name, id: item.n.id, index: index, size: item.n.properties.size.low, keywords: item.n.properties.keywords})
		})
		files.sort((e, f) => e.size - f.size)
		return files;
	}

	public static createBuckets(files: File[], numBuckets: number) {
		const minSize = files[0].size;
		const maxSize = files[files.length - 1].size;
		//console.log(minSize, maxSize)
		
		const bucketRange = (maxSize - minSize) / numBuckets;
		const buckets: Bucket[] = [];
		for (let i = 0; i < numBuckets; i++) {
			const rangeStart = minSize + i * bucketRange;
			const rangeEnd = rangeStart + bucketRange;
			buckets.push({ id: i, range: "size from " + rangeStart.toFixed(0) + ' bytes to ' + rangeEnd.toFixed(0) + ' bytes', nodes: files.filter(f => f.size >= rangeStart && f.size < rangeEnd)});
		}

		let count = 0;
		buckets.forEach((b) => b.nodes.forEach((n) => {n.index = count; count++;}))
		
		return buckets;
	}

	public static createBucketsByYear(files: File[]): {buckets: Bucket[], count: number} {
		const regex: RegExp = /\s*\(\s*(\d{4})\s*\)\s*/;
		const buckets: Bucket[] = [];
		let count = 0;
		for (const file of files) {
			const year: string | undefined = file.name.match(regex)?.[1];
			if (year) {
				const parsedYear = parseInt(year);
				const bucket = buckets.find(b => b.id == parsedYear);
				if (bucket) {
					bucket.nodes.push(file);
				} else {
					buckets.push({ id: parsedYear, range: year, nodes: [file]});
				}
			}
		}
		count = 0;
		buckets.sort((a, b) => parseInt(a.range) - parseInt(b.range))
		buckets.forEach((b) => b.nodes.forEach((n) => {n.index = count; count++;}))
		return {buckets: buckets, count: count + 1};
	}

	public static createBucketsByFileEnding(files: File[]): {buckets: Bucket[], count: number} {
		const buckets: Bucket[] = [];
		let count = 0;
		for (const file of files) {
			const fileEnding: string | undefined = file.name.split('.').pop();
			if (fileEnding) {
				const bucket = buckets.find(b => b.range == fileEnding);
				if (bucket) {
					bucket.nodes.push(file);
				} else {
					buckets.push({ id: count, range: fileEnding, nodes: [file]});
				}
			}
		}
		count = 0;
		buckets.sort((a, b) => a.range.localeCompare(b.range))
		buckets.forEach((b) => b.nodes.forEach((n) => {n.index = count; count++;}))
		return {buckets: buckets, count: count + 1};
	}
	  
    public static async layoutGraph(req: Request): Promise<AppResponse<Graph>> {
		LoggerService.log(req.body)
		const data = await DatabaseService.build(req).run();
		const dataHistogram = await DatabaseService.build(req).getHistogram();
		const dataFiles = await DatabaseService.build(req).getFiles() as any;
		//const graph = LayouterMock.getMock();
		const graph = LayouterController.dataToGraph(data);
		graph.histogram = LayouterController.formatHistogram(dataHistogram);
		graph.buckets = LayouterController.createBuckets(LayouterController.formatToFile(dataFiles), 4);
		const bucketsByYear = LayouterController.createBucketsByYear(LayouterController.formatToFile(dataFiles));
		const bucketsByFileEnding = LayouterController.createBucketsByFileEnding(LayouterController.formatToFile(dataFiles));
		graph.bucketsByYear = bucketsByYear.buckets;
		graph.filesCountByYear = bucketsByYear.count;
		graph.filesCountByFileEnding = bucketsByFileEnding.count;
		graph.filesCount = dataFiles.length;
		graph.bucketsByFileEnding = bucketsByFileEnding.buckets;
		LayouterController.setRandomPositions(graph);
		LayouterController.run(graph);
		LayouterController.normalizePositions(graph);
		if (data.length == 0) {
			graph.tree = undefined;
		} else {
			console.log(graph)
			graph.tree = LayouterController.formatAsTree(graph);
		}
		return {data: graph, requestBody: req.body} as AppResponse<Graph>;
	}
}
