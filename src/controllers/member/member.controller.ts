
import express from "express"; 
import { MemberService } from "./member.service";
import { Member } from '../../entities/Member';

const memberService = new MemberService();
// TODO make helper to handle response
export class MemberController {
 
  async getMembers(req: express.Request, res: express.Response) {
    try {
      const members: Member[] = await memberService.getAllMembers();
      res.json({
        success: true,
        status: 200,
        data: MemberService,
      });
      return members;
    } catch (error) {
      console.log(error);
      res.status(500).json({
        errMessage: "Internal Server Error",
      });
    }
  }

  async getMemberById(req: express.Request, res: express.Response) {
    try {
      const memberId: number = +req.params.id;
      const member = await memberService.getMemberById(memberId);
      res.status(200).json({
        success: true,
        status: 200,
        data: member,
      });
    } catch (error:any) {
      res.status(404).json({
        status: 404,
        error: error.message,
        success: false
      });
    }
  }

   
}
