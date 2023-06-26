import { IsNotEmpty } from "class-validator";


export class BotMessageDto{
   
    @IsNotEmpty()
    message_key: string;
  
    @IsNotEmpty()
    message_content: string;
}