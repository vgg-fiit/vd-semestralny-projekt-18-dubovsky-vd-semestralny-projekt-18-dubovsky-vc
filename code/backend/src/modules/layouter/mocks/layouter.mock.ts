import { Edge, type Graph, Node } from '../../graph/interfaces/graph.interface';

export class LayouterMock {
	public static getMock(): Graph {
        return {
			nodes: [
				new Node('dog', 0, 5.5),
                new Node('cat', 1, 4.5),
				new Node('cow', 2, 3.5),
                new Node('play', 3, 2.5),
			],
            edges: [new Edge(0, 1), new Edge(2, 3), new Edge(4, 3)],
        };
    }
}
