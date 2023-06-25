import { DeleteResult, Repository } from "typeorm";
import { bot } from "../../app";
import { myDataSource } from "../../app-data-source"; 
import { BotMessage } from "../../entities/BotMessage"; 
import { BotMessageDto } from "../../types/bot-message.type";
  

export class BotMessageService {
    private readonly botMessagesRepository:Repository<BotMessage>;
    constructor(){
        this.botMessagesRepository = myDataSource.getRepository(BotMessage)
    }
   
    async getAllBotMessages():Promise<BotMessage[]>{
        try{
        
            const BotMessagess:BotMessage[] = await this.botMessagesRepository.find();
        return BotMessagess;
        }catch(error:any){
            throw Error(error)   
        }
    }

   
    async getBotMessageById(id:number):Promise<BotMessage>{
        try{
            const BotMessages:BotMessage|null = await this.botMessagesRepository.findOneBy({id});
            if(!BotMessages){
                throw Error('BotMessage Not Found')
            }
            return BotMessages;
        }catch(error:any){
            throw Error(error)   
        }
    }


    async addBotMessages(botMessages:BotMessageDto):Promise<BotMessage> {
        
        try{
            const newBotMessages:BotMessage = new BotMessage();
            newBotMessages.messageContent = botMessages.messageContent;
            newBotMessages.messageKey = botMessages.messageKey;
            return await this.botMessagesRepository.save(newBotMessages);
        }catch(error:any){
            throw Error(error)   
        }
    } 

    async updateBotMessages(botMessages:BotMessageDto,id:number):Promise<BotMessage> {
        
        try{
            const newBotMessages:BotMessage = await this.getBotMessageById(id)
            newBotMessages.messageContent = botMessages.messageContent;
            newBotMessages.messageKey = botMessages.messageKey;
            const messages =  await this.botMessagesRepository.save(newBotMessages);
            bot.updateData();
            return messages;
        }catch(error:any){
            throw Error(error)   
        }
    } 

    async deleteBotMessage(id:number):Promise<void> {
        const deleted:DeleteResult = await this.botMessagesRepository.delete(id)
        if(deleted.affected ==0){
            throw Error('BotMessage Not Found') 
        }
    } 

}