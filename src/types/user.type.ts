import { IsNotEmpty } from "class-validator";


export class UserDto {

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    role_id: number;

}