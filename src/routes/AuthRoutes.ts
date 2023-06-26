import * as express from 'express'
import AuthController from '../controllers/auth/auth.controller';
 
const router = express.Router();
 
const authController:AuthController = new  AuthController();

 
router.post("/signin",authController.signIn);

router.post("/change-password",authController.changePassword);

 
 
 

 
export default router;
