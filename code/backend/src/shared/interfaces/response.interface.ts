export interface AppResponse<T> {
    meta?: Record<string, string | number>;
    data?: T;
    error?: AppResponseError;
}

export interface AppResponseError {
    status: number;
    message: string;
}
