import { TypeEnum } from "../enums/TypeEnum";
import { Member } from '../entities/Member';
import { MemberDto } from './member.type';

export class EventInterface{
    address: string; 
    description: string;
    media:string[] ;
    type:TypeEnum
    member:MemberDto;
}