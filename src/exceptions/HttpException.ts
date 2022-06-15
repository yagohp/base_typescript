export default class HttpException extends Error {
    public status: number;
    public message: string;
    public messageArr: string[];
    constructor(status: number, message: string|Array<string>) {
        if(typeof message === "string"){
            super(message);
            this.message = message;
        }else{
            super("Bad request");
            this.messageArr = message;
        }
        
        this.status = status;
    }
}