import { type ValidationError, validationResult } from 'express-validator/src';
import { type NextFunction, type Request, type Response } from 'express';
import { AppResponse, type AppResponseError } from '../interfaces/response.interface';

export function generateMessageFromValidationErrors(errors: ValidationError[]): string {
    return JSON.stringify(errors.map((error) => error.msg));
}

export function applyErrorHandling(
	error: AppResponseError,
	req: Request,
	res: Response<unknown>,
	next: NextFunction
): void {
	console.log("#######################")
	console.log("OCCURED FOLLOWING ERROR:")
	console.log(error, "\n")
	console.log("RESPONSE:")
    res.status(error.status).send({
		error: {
            code: error.status,
			message: error.message,
		} as AppResponse<any>,
	});
}

export function applyValidationHandling(req: Request, res: Response<unknown>, next: NextFunction): void {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
		const validationError: AppResponse<any> = {
            error: {
                status: 400,
				message: JSON.stringify(validationErrors.array().map((error) => error.msg)),
			},
        } as AppResponse<any>;
        res.status((<AppResponseError> validationError.error).status).send(validationError);
    } else {
		next();
	}
}

export const commonRequestValidationChain = [];
