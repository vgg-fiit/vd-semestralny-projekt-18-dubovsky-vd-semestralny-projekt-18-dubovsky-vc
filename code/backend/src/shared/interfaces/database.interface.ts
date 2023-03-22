export interface DBRecord {
    id: number,
    labels?: string[],
    properties?: any,
    start?: number,
    end?: number,
    type?: string
}

export enum NodeType {
    Directory = "Directory",
    File = "File", 
    Word = "Word", 
    Size = "Size"
}