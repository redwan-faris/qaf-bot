import { Repository } from "typeorm";
import { myDataSource } from "../../app-data-source"; 
import { Media } from "../../entities/Media";
import { MediaInterface } from "../../types/media.type";



export class MediaService {
    private readonly mediaRepository:Repository<Media>;
    constructor(){
        this.mediaRepository = myDataSource.getRepository(Media)
    }
   
    async getAllMedia():Promise<Media[]>{
        try{
        
            const medias:Media[] = await this.mediaRepository.find();
        return medias;
        }catch(error:any){
            throw Error(error)   
        }
    }

   
    async getMediaById(id:number):Promise<Media>{
        try{
            const media:Media|null = await this.mediaRepository.findOneBy({id});
            if(!media){
                throw Error('Media Not Found')
            }
            return media;
        }catch(error:any){
            throw Error(error)   
        }
    }

    async addMedia(path:string,id:number):Promise<Media> {
        
        try{
            const media:Media = new Media()
            media.path = path;
            media.eventId = id;
            return await this.mediaRepository.save(media);
        }catch(error:any){
            throw Error(error)   
        }
    } 

}