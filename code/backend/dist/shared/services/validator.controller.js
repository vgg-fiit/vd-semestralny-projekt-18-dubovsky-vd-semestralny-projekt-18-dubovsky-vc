"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonRequestValidationChain = exports.applyValidationHandling = exports.applyErrorHandling = exports.generateMessageFromValidationErrors = void 0;
const src_1 = require("express-validator/src");
function generateMessageFromValidationErrors(errors) {
    return JSON.stringify(errors.map((error) => error.msg));
}
exports.generateMessageFromValidationErrors = generateMessageFromValidationErrors;
function applyErrorHandling(error, req, res, next) {
    res.status(error.status).send({
        error: {
            code: error.status,
            message: error.message
        },
    });
    return;
}
exports.applyErrorHandling = applyErrorHandling;
function applyValidationHandling(req, res, next) {
    const validationErrors = (0, src_1.validationResult)(req);
    if (!validationErrors.isEmpty()) {
        const validationError = {
            error: {
                status: 400,
                message: JSON.stringify(validationErrors.array().map((error) => error.msg)),
            },
        };
        res.status(validationError.error.status).send(validationError);
        return;
    }
    else {
        next();
    }
}
exports.applyValidationHandling = applyValidationHandling;
exports.commonRequestValidationChain = [];
//# sourceMappingURL=validator.controller.js.map