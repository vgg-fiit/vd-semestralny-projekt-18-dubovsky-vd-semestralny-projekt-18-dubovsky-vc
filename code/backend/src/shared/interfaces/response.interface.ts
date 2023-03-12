export interface AppResponse<T> {
	meta?: { [index: string]: string | number };
	data?: T;
	error?: AppResponseError;
}

export interface AppResponseError {
	status: number;
	message: string;
}
