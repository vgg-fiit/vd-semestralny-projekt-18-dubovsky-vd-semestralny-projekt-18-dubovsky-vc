import * as fs from 'fs';

export class LoggerService {

    public static log(what: object) {
        try {
            console.log(`Log ${(<string>(new Error()).stack).split("\n")[2].trim()}:\n`,
            JSON.stringify(what))
        } catch(e: any) {
            console.log(JSON.stringify(what))
        }
    }

    public static printToFile(what: object) {
        fs.appendFileSync('log.txt', JSON.stringify(what) + '\n');
    }

    public static warn(what: object) {
        try {
            console.warn(`Warn ${(<string>(new Error()).stack).split("\n")[2].trim()}:\n`,
            JSON.stringify(what))
        } catch(e: any) {
            console.warn(JSON.stringify(what))
        }
    }
}