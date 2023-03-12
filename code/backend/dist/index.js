"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const graph_controller_1 = require("./modules/graph/graph.controller");
const validator_controller_1 = require("./shared/services/validator.controller");
const port = 14444;
const timeout = 300000; // 5 minutes
const publicFolderUrl = '/public';
function createRoutes(app = (0, express_1.default)()) {
    app.use(express_1.default.json({ limit: '5mb' }));
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(express_1.default.static(path_1.default.join(__dirname, publicFolderUrl)));
    app.use(`${graph_controller_1.GraphController.pathPrefix}`, graph_controller_1.GraphController.getRoutes());
    app.use(validator_controller_1.applyErrorHandling);
    return app;
}
createRoutes()
    .listen(port, () => console.info(`Express server is listening on http://localhost:${port} with a request timeout of ${timeout}`))
    .setTimeout(timeout);
//# sourceMappingURL=index.js.map