export class LoggerService {

    public static log(what: string) {
        try {
            console.log(`Log ${(<string>(new Error()).stack).split("\n")[2].trim()}:`,
            what)
        } catch(e: any) {
            console.log(what)
        }
    }

    public static warn(what: string) {
        try {
            console.warn(`Warn ${(<string>(new Error()).stack).split("\n")[2].trim()}:`,
            what)
        } catch(e: any) {
            console.warn(what)
        }
    }
}