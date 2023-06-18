import { Repository } from "typeorm";
import { myDataSource } from "../../app-data-source"; 
import { Event } from "../../entities/Event";
import { Media } from "../../entities/Media";
import { EventInterface } from "../../types/event.type";
import { MediaInterface } from "../../types/media.type";



export class EventService {
    private readonly eventRepository:Repository<Event>;
    constructor(){
        this.eventRepository = myDataSource.getRepository(Event)
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
            const newEvent:Event = new Event();
            newEvent.address = event.address;
            newEvent.description = event.description;
            newEvent.reporter = event.reporter;
            return await this.eventRepository.save(newEvent);
        }catch(error:any){
            throw Error(error)   
        }
    } 

}