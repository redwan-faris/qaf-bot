 
import * as express from 'express'
import { RoleController } from '../controllers/role/role.controller'; 


const router = express.Router();
const roleController = new  RoleController();

 
router.get("/", roleController.getAllRoles);

router.get("/:id", roleController.getRoleById);

router.post("/", roleController.createRole);

router.patch("/:id", roleController.updateRole);

router.delete('/:id',roleController.deleteRole);

 
export default router;
