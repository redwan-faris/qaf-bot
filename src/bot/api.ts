import { EventService } from "../controllers/event/event.service";
import { MediaService } from "../controllers/Media/media.service"
import { EventInterface } from "../types/event.type";
import { MediaInterface } from "../types/media.type"



export const saveMedia = async (media:string[],id:number) => {
    const mediaService:MediaService = new MediaService();
    for(let i =0;i<media.length;i++){
        await mediaService.addMedia(media[i],id);
    }
}

export const saveEvent = async (event:EventInterface) => {
    const eventService:EventService = new EventService();
    return await eventService.addEvent(event);
}