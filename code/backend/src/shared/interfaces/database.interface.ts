export interface DBRecord {
    id: number,
    labels?: string[],
    properties?: any,
    start?: number,
    end?: number,
    type?: string
}