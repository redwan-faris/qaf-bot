 
import * as express from 'express'
import { UserController } from '../controllers/user/user.controller';


const router = express.Router();
const userController = new  UserController();

 
router.get("/", userController.getAllUsers);

router.get("/:id", userController.getUserById);

router.post("/", userController.createUser);

router.patch("/:id", userController.updateUser);

router.delete('/:id',userController.deleteUser);

 
export default router;
