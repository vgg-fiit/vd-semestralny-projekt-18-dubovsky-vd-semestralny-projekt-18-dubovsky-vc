"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphController = void 0;
const express_1 = require("express");
class GraphController {
    static getRoutes() {
        const router = (0, express_1.Router)();
        router.get(GraphController.getGraph, GraphController.fetchGraph);
        return router;
    }
    /** @method GET
     * @path /graph/getGraph
     * @returns nodes and edges of the created graph
     */
    static fetchGraph(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.send({});
            }
            catch (exception) {
                next(exception);
            }
        });
    }
}
exports.GraphController = GraphController;
GraphController.pathPrefix = "/graph";
GraphController.getGraph = '/get';
//# sourceMappingURL=graph.controller.js.map