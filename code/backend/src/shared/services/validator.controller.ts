import { ValidationError, validationResult } from 'express-validator/src';
import { NextFunction, Request, Response } from 'express';
import { AppResponseError } from '../interfaces/response.interface';

export function generateMessageFromValidationErrors(errors: ValidationError[]): string {
	return JSON.stringify(errors.map((error) => error.msg));
}

export function applyErrorHandling(error: AppResponseError, req: Request, res: Response<unknown>, next: NextFunction): void {
    res.status(error.status).send({
        error: {
            code: error.status,
            message: error.message
        },
    });
    return;
}


export function applyValidationHandling(req: Request, res: Response<unknown>, next: NextFunction): void {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const validationError = {
            error: {
                status: 400,
                message: JSON.stringify(validationErrors.array().map((error) => error.msg)),
            },
        };
        res.status(validationError.error.status).send(validationError);
        return;
    } else {
        next();
    }
}


export const commonRequestValidationChain = [
];