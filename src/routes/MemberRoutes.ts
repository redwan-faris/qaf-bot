import * as express from 'express'
import { checkJwt } from "../middleware/checkJwt";
import { checkRole } from "../middleware/checkRole";
import { MemberController } from '../controllers/member/member.controller';

const router = express.Router();
 
const memberController = new  MemberController();

 
router.get("/", [checkJwt, checkRole(["superadmin","admin"])] , memberController.getMembers);

 
router.get("/:id", [checkJwt, checkRole(["superadmin","admin"])] , memberController.getMemberById);


 

 
export default router;
