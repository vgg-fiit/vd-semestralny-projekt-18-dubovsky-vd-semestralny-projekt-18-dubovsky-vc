import path from 'path';
import express, { type Express } from 'express';
import { GraphController } from './modules/graph/graph.controller';
import { applyErrorHandling } from './shared/services/validator.controller';
import { ConnectionController } from './modules/connection/connection.controller';
import cors from 'cors';

const port = 14444;
const timeout = 300000; // 5 minutes
const publicFolderUrl = '/public';

function createRoutes(app: Express = express()): Express {
    app.use(express.json({ limit: '5mb' }));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, publicFolderUrl)));
    app.use(`${GraphController.pathPrefix}`, GraphController.getRoutes());
    app.use(`${ConnectionController.pathPrefix}`, ConnectionController.ping);


    return app;
}

createRoutes()
    .listen(port, () => {
        console.info(`Express server is listening on http://localhost:${port} with a request timeout of ${timeout}`);
    })
    .setTimeout(timeout);
