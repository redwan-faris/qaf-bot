import { IsNotEmpty, Max } from "class-validator";


export class BotMessageDto{
   
    @IsNotEmpty()
    message_key: string;
  
    @IsNotEmpty()
    @Max(500)
    message_content: string;
}