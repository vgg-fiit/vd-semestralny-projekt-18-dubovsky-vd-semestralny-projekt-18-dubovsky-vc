import { type ValidationError, validationResult, body, CustomValidator } from 'express-validator/src';
import { type NextFunction, type Request, type Response } from 'express';
import { AppResponse, type AppResponseError } from '../interfaces/response.interface';
import { Keywords, NodeType } from '../interfaces/database.interface';

export function generateMessageFromValidationErrors(errors: ValidationError[]): string {
    return JSON.stringify(errors.map((error) => error.msg));
}

export function exists<T extends object>(value: string, enumeration: T): boolean {
	return Object.values(enumeration).includes(value as T[keyof T]);
} 

export function customCheck<T extends Object>(value: any, key: string, type: T): boolean {
	if (value == "" || value == undefined)
		return true;
	if (!exists(value, type))
		throw new Error(`${key} is not of correct type`);
	return true;
}

export const validateNeo4JRequest = [
	body('nodeType').notEmpty().withMessage('nodeType must be not empty').custom(value => customCheck(value, 'nodeType', NodeType)),
	body('keyword.key').custom(value => customCheck(value, 'keyword.key', Keywords)),
	body('keyword.value').custom(value => customCheck(value, 'keyword.key', Keywords)),
	body('range.from').custom(value => !value || value === '' || !isNaN(value)).withMessage("range must be either numeric or empty"),
	body('range.to').custom(value => !value || value === '' || !isNaN(value)).withMessage("range must be either numeric or empty"),
	body('relationship').custom(value => !value || value === '' || value === 'true' || value === 'false').withMessage("relationship must be empty or boolean"),
	body('limit').custom(value => !value || value === '' || !isNaN(value)).withMessage("range must be either numeric or empty")
]

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

export function applyLocalCORS(req: Request, res: Response<AppResponse<any>>, next: NextFunction): void {
	res.set('Access-Control-Allow-Origin', '*');
	res.set('Access-Control-Allow-Methods', '*');
	res.set('Access-Control-Allow-Headers', '*');
	next();
}

export const commonRequestValidationChain = [];
