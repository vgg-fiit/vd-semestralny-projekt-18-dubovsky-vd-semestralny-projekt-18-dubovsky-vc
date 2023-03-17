import { type NextFunction, type Request, type Response, Router } from 'express';
import { type AppResponse } from '../../shared/interfaces/response.interface';
import { LayouterController } from '../layouter/layouter.controller';
import { type Graph } from './interfaces/graph.interface';
export class GraphController {
    static readonly pathPrefix = '/graph';
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
	private static async fetchGraph(req: Request, res: Response<AppResponse<Graph>>, next: NextFunction) {
		try {
			const layoutedGraph: AppResponse<Graph> = LayouterController.layoutGraph(req);
			res.send(layoutedGraph);
		} catch (exception) {
			next(exception);
		}
	}
}
