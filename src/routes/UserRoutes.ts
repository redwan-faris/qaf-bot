 
import * as express from 'express'
import { UserController } from '../controllers/user/user.controller';
import { checkJwt } from '../middleware/checkJwt';
import { checkRole } from '../middleware/checkRole';


const router = express.Router();
const userController = new  UserController();

 
router.get('/', [checkJwt, checkRole(["superadmin"])] ,userController.getAllUsers);

router.get("/:id", [checkJwt, checkRole(["superadmin","admin"])] ,userController.getUserById);

router.post("/", [checkJwt, checkRole(["superadmin"])] ,userController.createUser);

router.patch("/:id",[checkJwt, checkRole(["superadmin"])] , userController.updateUser);

router.delete('/:id',[checkJwt, checkRole(["superadmin"])] ,userController.deleteUser);

 
export default router;
