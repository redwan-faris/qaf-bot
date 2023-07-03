import { Repository } from "typeorm";
import { myDataSource } from "../../app-data-source"; 
import { Event } from "../../entities/Event";
import { EventInterface } from "../../types/event.type"; 
import { MemberService } from '../member/member.service';
import { Member } from "../../entities/Member";



export class EventService {
    private readonly eventRepository:Repository<Event>;
    private readonly memberService:MemberService;
    constructor(){
        this.eventRepository = myDataSource.getRepository(Event);
        this.memberService = new MemberService();
    }
   
    async getAllEvents():Promise<Event[]>{
        try{
        
            const events:Event[] = await this.eventRepository.find();
        return events;
        }catch(error:any){
            throw Error(error)   
        }
    }

   
    async getEventById(id:number):Promise<Event>{
        try{
            const event:Event|null = await this.eventRepository.findOneBy({id});
            if(!event){
                throw Error('event Not Found')
            }
            return event;
        }catch(error:any){
            throw Error(error)   
        }
    }

    async addEvent(event:EventInterface):Promise<Event> {    
        try{
       
  
            let member:Member|null = await this.memberService.getMemberByTelegramId(event.member.memberId);
            if(!member){
                member = await this.memberService.addMember(event.member)
            }
            const newEvent:Event = new Event();
            newEvent.address = event.address;
            newEvent.description = event.description;
            newEvent.member = member;
            newEvent.mebmerId = member.id;
            newEvent.type = event.type;
            return await this.eventRepository.save(newEvent);
        }catch(error:any){
            throw Error(error)   
        }
    } 

}