import { BotMessageService } from "../controllers/bot-message/bot-message.service";
import { EventService } from "../controllers/event/event.service";
import { MediaService } from "../controllers/Media/media.service"
import { BotMessage } from "../entities/BotMessage";
import { Event } from "../entities/Event";
import { EventInterface } from "../types/event.type"; 
import { MemberService } from '../controllers/member/member.service';
import { Member } from '../entities/Member'; 


export const saveMedia = async (media: string[], event: Event) => {
    const mediaService: MediaService = new MediaService();
    for (let i = 0; i < media.length; i++) {
        await mediaService.addMedia(media[i], event);
    }
}

export const saveEvent = async (event: EventInterface,memberId:number) => {
    const eventService: EventService = new EventService();
    return await eventService.addEvent(event,memberId);
}

export const getBotMessages = async () => {
    const botMessageService: BotMessageService = new BotMessageService();
    const messages: BotMessage[] = await botMessageService.getAllBotMessages();
 
    return messages;
}

export const checkIfUserExist = async (id: number) => {
    const memberService: MemberService = new MemberService();
    const member: Member | null = await memberService.getMemberByTelegramId(id);
    return member;
}

export const getOrCreateMember = async (id: number) => {
    const memberService: MemberService = new MemberService();
    const member: Member | null = await memberService.getMemberOrCreate(id);
    return member;
}

export const updateMember = async (id:number,step:string) => {
    const memberService: MemberService = new MemberService();
    await memberService.updateStep(id,step)
}