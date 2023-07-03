import { TypeEnum } from "../enums/TypeEnum";

export class EventInterface{
    address: string;
    reporter:string;
    description: string;
    media:string[] ;
    type:TypeEnum
}