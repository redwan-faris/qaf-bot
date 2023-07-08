import { DeleteResult, Repository } from "typeorm";
import { myDataSource } from "../../app-data-source";
import { Event } from "../../entities/Event";
import { EventInterface } from "../../types/event.type";
import { MemberService } from '../member/member.service';
import { Member } from "../../entities/Member";
import { Media } from "../../entities/Media";
import path from "path";
import * as fs from 'fs';


export class EventService {
    private readonly eventRepository: Repository<Event>;
    private readonly memberService: MemberService;
    constructor() {
        this.eventRepository = myDataSource.getRepository(Event);
        this.memberService = new MemberService();
    }

    async getAllEvents(page:number,limit:number){
        try {
            const offset = (page - 1) * limit;
            const events: Event[] = await this.eventRepository.find({
                skip: offset,
                take: limit,
            });
            const count =  await this.eventRepository.count();
            return {events:events,count:count};
        } catch (error: any) {
            throw Error(error)
        }
    }


    async getEventById(id: number): Promise<Event> {
        try {
            const event: Event | null = await this.eventRepository.findOneBy({ id });
            if (!event) {
                throw Error('event Not Found')
            }
            return event;
        } catch (error: any) {
            throw Error(error)
        }
    }

    async addEvent(event: EventInterface,memberId:number): Promise<Event> {
        try {


            let member: Member | null = await this.memberService.updateMember(memberId,event.member);
            if (!member) {
                member = await this.memberService.addMember(event.member)
            }
            const newEvent: Event = new Event();
            newEvent.address = event.address;
            newEvent.description = event.description;
            newEvent.member = member;
            newEvent.mebmerId = member.id;
            newEvent.type = event.type;
            return await this.eventRepository.save(newEvent);
        } catch (error: any) {
            throw Error(error)
        }
    }
    async deleteEvent(id:number):Promise<void> {
      const event :Event = await this.getEventById(id);
      let paths:string[]=[];
      paths.push(path.join(process.cwd(),  `public/pictures/thumb/`));
      paths.push(path.join(process.cwd(),  `public/pictures/normal/`));
      paths.push(path.join(process.cwd(),  `public/videos/normal/`));
      event.media.forEach(media => {
         console.log(media)
        for(let i =0;i<paths.length;i++){
            console.log(paths[i]+media.path)
            if (fs.existsSync(paths[i]+media.path)) {
                
                fs.unlinkSync(paths[i]+media.path);
              
              }  
        }
      });
      await this.eventRepository.remove(event)
    } 


}