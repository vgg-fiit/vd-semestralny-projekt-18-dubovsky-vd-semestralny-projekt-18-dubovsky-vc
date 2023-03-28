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

export enum Keywords {
    Extension = "extension",
    Filename = "filename",
    Fullpath = "fullpath",
    ISBN = "isbn",
    Keywords = "keywords",
    Metadata = "metadata",
    Name = "name",
    NodeID = "node_id",
    Size = "size",
    Word = "word"
}