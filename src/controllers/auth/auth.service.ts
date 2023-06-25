import dotenv from 'dotenv';
import * as jwt from "jsonwebtoken"; 
import { User } from "../../entities/User";
import { Repository } from "typeorm";
import { myDataSource } from "../../app-data-source";
import { SignInDto } from "../../types/sign-in.type";
 
dotenv.config();

class AuthService {
    private readonly userRepository:Repository<User>;
    constructor(){
        this.userRepository = myDataSource.getRepository(User)
    }

    async singIn(signInDto:SignInDto){
        const {username,password} = signInDto;
        const user:User|null = await this.userRepository.findOne({where:{username}});
        if(!user || !user?.checkIfUnencryptedPasswordIsValid(password)){
            throw Error("Username or password in invalid")
        }
        const token:string = jwt.sign(
            { userId: user.id, username: user.username,role:user.role.role_name },
            process.env.JWT_SECRET as string
          );
      return {token,user};
    }
   
}   
export default AuthService;