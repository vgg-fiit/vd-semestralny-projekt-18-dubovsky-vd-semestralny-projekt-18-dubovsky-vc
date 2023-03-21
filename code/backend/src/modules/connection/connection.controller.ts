import { type NextFunction, type Request, type Response } from 'express';
import { AppResponse } from '../../shared/interfaces/response.interface';
import { DatabaseService } from '../../shared/services/database.service';

export class ConnectionController {
    static readonly pathPrefix = '/connection';

    /** @method GET
     * @path /ping
     * @returns neo4j service status
     */
	static async ping(req: Request, res: Response<{}>, next: NextFunction) {
		try {
			const json = await DatabaseService.run('MATCH (n) RETURN n');
			res.json(json);
		} catch (exception) {
			next(exception);
		}
	}
}