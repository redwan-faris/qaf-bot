import { IsNotEmpty } from "class-validator";


export class BotMessageDto{
   
    @IsNotEmpty()
    messageKey: string;
  
    @IsNotEmpty()
    messageContent: string;
}