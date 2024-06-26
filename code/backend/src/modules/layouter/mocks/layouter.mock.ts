import { Edge, type Graph, Node } from '../../graph/interfaces/graph.interface';
import { LayouterController } from '../layouter.controller';

export class LayouterMock {
	public static getMock(): Graph {
        const graph = {
			nodes: [
				new Node('dog', 0, 5.5),
                new Node('cat', 1, 4.5),
				new Node('cow', 2, 3.5),
                new Node('play', 3, 2.5),
			],
            edges: [new Edge(0, 1), new Edge(1, 2), new Edge(2, 3), new Edge(3, 0)],
            mapping: {0: 0, 1: 1, 2: 2, 3: 3},
            nodesCount: 4,
            edgesCount: 4   
        };
        LayouterController.setRandomPositions(graph);
        return graph
    }
}
