import { type NextFunction, type Request, type Response } from 'express';
import { Keywords, NodeType } from '../../shared/interfaces/database.interface';
import { DatabaseService, DatabaseSession } from '../../shared/services/database.service';

export class ConnectionController {
    static readonly pathPrefix = '/connection';

    /** @method GET
     * @path /ping
     * @returns neo4j service status
     */
	static async ping(req: Request, res: Response<{}>, next: NextFunction) {
		try {
			const session = new DatabaseSession();
			session.nodeType = NodeType.Directory;
			res.json(await session.run());
		} catch (exception) {
			next(exception);
		}
	}
}