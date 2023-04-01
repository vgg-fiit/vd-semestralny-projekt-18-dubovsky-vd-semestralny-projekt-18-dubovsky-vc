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
        session.nodeType = body["nodeType"]
        session.keyword = body["keyword"] ? {
                key: body["keyword"]["key"],
                value: body["keyword"]["value"]
            }: undefined
        session.range = body["range"] ? {
                from: body["range"]["from"],
                to: body["range"]["to"]
            }: undefined
        session.relationship = body["relationship"]
        session.limit = body["limit"]
        return session
    }

    static filter(session: DatabaseSession): Promise<{}[]> {
        const containsRange = session.range? `:CONTAINS*${session.range.from? session.range.from: 0}${session.range.to? `..${session.range.to}`: ""}`: "";
        const query = `MATCH (n:${session.nodeType} {name:'root'})${session.relationship? `<-[r${containsRange? containsRange: ""}]-(m)`: ''}`
        const where = session.keyword ? `WHERE m.${session.keyword? `${session.keyword.key}='${session.keyword.value}'`: ""}`: ""
        const returnParam = `RETURN n${session.relationship ? ',r,m': ''}`
        const limitParam = session.limit ? `LIMIT ${session.limit}`: "";
        return DatabaseService.run(`${query} ${where} ${returnParam} ${limitParam}`);
	}
}

export class DatabaseSession {
    nodeType: NodeType;
    keyword?: {key: Keywords, value: string};
    range?: {from?: number, to?: number};
    relationship?: boolean;
    limit?: number

    public async run(): Promise<{}[]> {
        return DatabaseService.filter(this);
    }
}