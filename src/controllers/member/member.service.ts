import { Repository } from "typeorm";
import { myDataSource } from "../../app-data-source";
import { Member } from "../../entities/Member";
import { MemberDto } from '../../types/member.type';



export class MemberService {
    private readonly memberRepository: Repository<Member>;
    constructor() {
        this.memberRepository = myDataSource.getRepository(Member)
    }

    // TODO Refactor the function
    async getMemberByTelegramId(id: number): Promise<Member | null> {
        console.log('-------------------------------------------')
        const member: Member | null = await this.memberRepository.findOneBy({ userBotId: id })
        if (!member) return null
        member.lastUsed = new Date();
        await this.memberRepository.save(member);
        return member;
    }

    async getAllMembers(): Promise<Member[]> {
        try {

            const members: Member[] = await this.memberRepository.find();
            return members;
        } catch (error: any) {
            throw Error(error)
        }
    }

   async getMemberOrCreate(id:number){
    try {

        let member: Member|null = await this.memberRepository.findOneBy({userBotId:id});
        if(!member){
            member =  new Member();
            member.userBotId = id;
            return await this.memberRepository.save(member);

        }
        return member
    } catch (error: any) {
        throw Error(error)
    }
   }

    async getMemberById(id: number): Promise<Member> {
        try {
            const member: Member | null = await this.memberRepository.findOneBy({ id });
            if (!member) {
                throw Error('member Not Found')
            }
            return member;
        } catch (error: any) {
            throw Error(error)
        }
    }

    async addMember(memberDto: MemberDto): Promise<Member> {
        try {
         
            const member: Member = new Member();
            member.full_name = memberDto.full_name;
            member.userBotId = memberDto.memberId;
            member.lastUsed = new Date();
            return await this.memberRepository.save(member);
        } catch (error: any) {
            throw Error(error)
        }
    }

    async updateMember(id:number,memberDto:MemberDto){
   
        try {
         
            const member = await this.getMemberById(id);
            member.full_name = memberDto.full_name;
            member.userBotId = memberDto.memberId;
            member.lastUsed = new Date();
            return await this.memberRepository.save(member);
        } catch (error: any) {
            throw Error(error)
        }
    }
 

    async updateStep(id:number,step:string){
   
        try {
         
            const member = await this.getMemberById(id);
            member.step = step;
            member.lastUsed = new Date();
            return await this.memberRepository.save(member);
        } catch (error: any) {
            throw Error(error)
        }
    }
    

}