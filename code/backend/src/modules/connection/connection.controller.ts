import { type NextFunction, type Request, type Response } from 'express';
import { Keywords, NodeType } from '../../shared/interfaces/database.interface';
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
			res.json(await DatabaseService.filter(NodeType.Directory, {key: Keywords.Extension, value: ".pdf"}, {to: 3}, true, 20));
		} catch (exception) {
			next(exception);
		}
	}
}