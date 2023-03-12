import { NextFunction, Request, Response, Router } from 'express';
import { AppResponse } from '../../shared/interfaces/response.interface';
import { Graph } from './interfaces/graph.interface';
export class GraphController {
    static readonly pathPrefix = "/graph"
	static readonly getGraph = '/get';

	static getRoutes(): Router {
		const router = Router();
		router.get(GraphController.getGraph, GraphController.fetchGraph);
		return router;
	}

	/** @method GET
	 * @path /graph/getGraph
	 * @returns nodes and edges of the created graph
	 */
	private static async fetchGraph(
		req: Request,
		res: Response<AppResponse<Graph>>,
		next: NextFunction
	) {
		try {
			res.send({})
		} catch (exception) {
			next(exception);
		}
	}
}
