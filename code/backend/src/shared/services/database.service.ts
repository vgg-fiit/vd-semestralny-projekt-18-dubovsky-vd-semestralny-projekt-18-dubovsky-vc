import neo4j, { Record } from 'neo4j-driver'
import { DBRecord, Keywords, NodeType } from '../interfaces/database.interface';
import dotenv from 'dotenv';
import { LoggerService } from './logger.service';
import { Request } from 'express';

export class DatabaseService {
    static config = dotenv.config();

    static driver = neo4j.driver(
        process.env.NEO4J_URL as string,
        neo4j.auth.basic(process.env.NEO4J_USERNAME as string, process.env.NEO4J_PASSWORD as string))

    static toJson(record: Record): {} {
        const output: {[key: PropertyKey]: DBRecord | Object} = {};
        
        record.keys.forEach((key) => {
            const value = record.get(key);
        
            if (neo4j.isNode(value)) {
                output[key] = {
                    id: value.identity.toNumber(),
                    labels: value.labels,
                    properties: value.properties,
                };
            } 
            else if (neo4j.isRelationship(value)) {
                output[key] = {
                    id: value.identity.toNumber(),
                    type: value.type,
                    properties: value.properties,
                    start: value.start.toNumber(),
                    end: value.end.toNumber(),
                };
            }
            else {
                output[key] = value;
            }
        });
        return output;
    }


    static async run(command: string): Promise<{}[]> {
        LoggerService.log({runningQuery: command});
        const session = DatabaseService.driver.session();
        try {
          const result = await session.run(command);
          const jsonArray = result.records.map(this.toJson);
          return jsonArray;
        } finally {
          await session.close();
        }
    }
    
    static build(request: Request) {
        const body = request.body
        const session = new DatabaseSession();
        session.nodeType = body.nodeType
        if (body.filter?.keywords?.length) {
            session.keywords = body.filter.keywords? body.filter.keywords: undefined
        }
        session.keyword = body.keyword ? {
            key: body.keyword.key,
            value: body.keyword.value
        }: undefined
        session.range = body.range ? {
                from: body.range.from,
                to: body.range.to
            }: undefined
        session.relationship = body.relationship == "true"
        session.limit = body.limit != undefined ? parseInt(body.limit): undefined
        session.name = body.name ? body.name: session.name
        session.id = body.id != undefined ? parseInt(body.id): undefined
        session.isbn = body.isbn != undefined ? body.isbn: false
        return session
    }

    static combineKeywords = (keywords: {key: Keywords, value: string}[]) => {
        let output: string = "[";
        keywords.forEach((keyword) => {
            output += `'${keyword.value.toLowerCase()}'${keywords.indexOf(keyword) != keywords.length - 1? ",": ""}`
        })
        output += "]";
        return output;
    }

    static getHistogram(session: DatabaseSession): Promise<{}[]> {
        const containsRange = session.range? `:CONTAINS*${session.range.from? session.range.from: 0}${session.range.to? `..${session.range.to}`: ""}`: "";
        const query = 
            session.id != undefined ? 
                `MATCH (n:${session.nodeType}) ${session.relationship? `<-[r${containsRange? containsRange: ""}]-(m:${session.nodeType})`: ''} WHERE ID(n)=${session.id}`:
                `MATCH (n:${session.nodeType} ${session.nodeType == NodeType.Directory || session.nodeType == NodeType.File ? `{name:'${session.name}'}`: ""}) ${session.relationship? `<-[r${containsRange? containsRange: ""}]-(m:${session.nodeType})`: ''}`      
        const where = session.keywords ?
            `WHERE any(substring IN ${DatabaseService.combineKeywords(session.keywords)} WHERE m.name CONTAINS substring)`:
            session.keyword ? `WHERE m.${session.keyword? `${session.keyword.key}='${session.keyword.value}'`: ""}`: ""
        const aggregate = `UNWIND m.keywords as word WITH word, count(word) as wordCount RETURN word, sum(wordCount) as aggregatedWordCount`;
        const limit = session.limit != undefined ? `LIMIT ${session.limit}`: "";
        return DatabaseService.run(`${query} ${where} ${aggregate} ${limit}`);
    }    

    static getFiles(session: DatabaseSession): Promise<{}[]> {
        const query = `MATCH (n: File)`
        const limit = session.limit != undefined ? `LIMIT ${session.limit}`: "";
        const where = session.keywords ?
            `WHERE any(keyword IN n.keywords WHERE keyword IN ${DatabaseService.combineKeywords(session.keywords)})`: "";
        const isbn = session.isbn? `${session.keywords ? " AND ": ""} WHERE (n.isbn) IS NOT NULL`: "";
        return DatabaseService.run(`${query} ${where} ${isbn} RETURN n ${limit}`);
    }

    static filter(session: DatabaseSession): Promise<{}[]> {
        const containsRange = session.range? `:CONTAINS*${session.range.from? session.range.from: 0}${session.range.to? `..${session.range.to}`: ""}`: "";
        const query =
            session.id != undefined ? 
                `MATCH (n:${session.nodeType}) WHERE ID(n)=${session.id} ${session.relationship ? `OPTIONAL MATCH (n) <-[r${containsRange? containsRange: ""}]-(m)`: ''}`: 
                `MATCH (n:${session.nodeType} ${session.nodeType == NodeType.Directory || session.nodeType == NodeType.File ? `{name:'${session.name}'}`: ""})${session.relationship? `<-[r${containsRange? containsRange: ""}]-(m)`: ''}`
        const where = session.keywords ?
            `WHERE any(keyword IN m.keywords WHERE keyword IN ${DatabaseService.combineKeywords(session.keywords)})`:
            session.keyword ? `WHERE m.${session.keyword? `${session.keyword.key}='${session.keyword.value}'`: ""}`: ""
        const returnParam = `RETURN n${session.relationship ? ',r,m': ''}`
        const limitParam = session.limit != undefined ? `LIMIT ${session.limit}`: "";
        return DatabaseService.run(`${query} ${where} ${returnParam} ${limitParam}`);
	}
}

export class DatabaseSession {
    nodeType: NodeType;
    keyword?: {key: Keywords, value: string};
    keywords?: {key: Keywords, value: string}[];
    range?: {from?: number, to?: number};
    relationship?: boolean;
    isbn?: boolean;
    limit?: number;
    name?: string = "root";
    id?: number;

    public async run(): Promise<{}[]> {
        return DatabaseService.filter(this);
    }

    public async getHistogram(): Promise<{}[]> {
        return DatabaseService.getHistogram(this);
    }

    public async getFiles(): Promise<{}[]> {
        return DatabaseService.getFiles(this);
    }
}