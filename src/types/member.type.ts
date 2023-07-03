
import { IsNotEmpty } from "class-validator";

export class MemberDto{
   
    @IsNotEmpty()
    full_name: string;
 
    @IsNotEmpty()
    memberId:number;
 
}
 