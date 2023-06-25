
import { IsNotEmpty } from "class-validator";

export class RoleDto{
   
    @IsNotEmpty()
    role_name: string;
 
}
 