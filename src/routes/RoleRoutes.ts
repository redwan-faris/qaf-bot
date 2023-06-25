 
import * as express from 'express'
import { RoleController } from '../controllers/role/role.controller'; 
import { checkJwt } from '../middleware/checkJwt';
import { checkRole } from '../middleware/checkRole';


const router = express.Router();
const roleController = new  RoleController();

 
router.get("/",[checkJwt, checkRole(["superadmin"])] , roleController.getAllRoles);

router.get("/:id",[checkJwt, checkRole(["superadmin",'admin'])] , roleController.getRoleById);

router.post("/",[checkJwt, checkRole(["superadmin"])] , roleController.createRole);

router.patch("/:id",[checkJwt, checkRole(["superadmin"])] , roleController.updateRole);

router.delete('/:id',[checkJwt, checkRole(["superadmin"])] ,roleController.deleteRole);

 
export default router;
