export class LoggerService {

    public static log(what: object) {
        try {
            console.log(`Log ${(<string>(new Error()).stack).split("\n")[2].trim()}:\n`,
            JSON.stringify(what))
        } catch(e: any) {
            console.log(JSON.stringify(what))
        }
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