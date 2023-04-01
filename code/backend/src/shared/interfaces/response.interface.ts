export interface AppResponse<T> {
    meta?: Record<string, string | number>;
    data?: T;
    error?: AppResponseError | Object;
}

export interface AppResponseError {
    status: number;
    message: string;
}
