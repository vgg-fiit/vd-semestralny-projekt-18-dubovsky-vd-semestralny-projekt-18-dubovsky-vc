import { type NextFunction, type Request, type Response, Router } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import { type AppResponse } from '../../shared/interfaces/response.interface';
import { validateNeo4JRequest } from '../../shared/services/validator.controller';
import { LayouterController } from '../layouter/layouter.controller';
import { type Graph } from './interfaces/graph.interface';
export class GraphController {
    static readonly pathPrefix = '/graph';
    static readonly getGraph = '/get';
	static readonly getGraphFiles = '/getFiles';

    static getRoutes(): Router {
		const router = Router();
		router.post(GraphController.getGraph, validateNeo4JRequest, GraphController.fetchGraph);
		router.post(GraphController.getGraphFiles, validateNeo4JRequest, GraphController.fetchGraphFiles);
		return router;
	}

    /** @method POST
     * @path /graph/get
     * @returns nodes and edges of the created graph
     */
	private static async fetchGraph(req: Request, res: Response<AppResponse<Graph>>, next: NextFunction) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.json({error: errors});
			} else {
				const layoutedGraph: AppResponse<Graph> = await LayouterController.layoutGraph(req);
				res.json(layoutedGraph);
			}
		} catch (exception) {
			next(exception);
		}
	}

	/** @method POST
     * @path /graph/getFiles
     * @returns files from the database
     */
	private static async fetchGraphFiles(req: Request, res: Response<AppResponse<Graph>>, next: NextFunction) {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				res.json({error: errors});
			} else {
				const layoutedGraph: AppResponse<Graph> = await LayouterController.getFiles(req);
				res.json(layoutedGraph);
			}
		} catch (exception) {
			next(exception);
		}
	}
}
