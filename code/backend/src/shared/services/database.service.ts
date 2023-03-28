import neo4j, { Record } from 'neo4j-driver'
import { DBRecord, Keywords, NodeType } from '../interfaces/database.interface';
import dotenv from 'dotenv';
import { LoggerService } from './logger.service';

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

    static filter(nodeType: NodeType, keyword?: {key: Keywords, value: string}, range?: {from?: number, to?: number}, relationship?: boolean, limit?: number): Promise<{}[]> {
        const containsRange = range? `:CONTAINS*${range.from? range.from: 0}${range.to? `..${range.to}`: ""}`: "";
        const query = `MATCH (n:${nodeType} {name:'root'})${relationship? `<-[r${containsRange? containsRange: ""}]-(m)`: ''}`
        const where = keyword ? `WHERE m.${keyword? `${keyword.key}='${keyword.value}'`: ""}`: ""
        const returnParam = `RETURN n${relationship ? ',r,m': ''}`
        const limitParam = limit ? `LIMIT ${limit}`: "";
        return DatabaseService.run(`${query} ${where} ${returnParam} ${limitParam}`);
	}
}