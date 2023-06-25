import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { validate } from "class-validator";
import { User } from "../../entities/User";
import { Repository } from "typeorm";
import { myDataSource } from "../../app-data-source";
import { SignInDto } from "../../types/sign-in.type";
 

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
            "config.jwtSecret",
          );
      return {token,user};
    }
   
}   
export default AuthService;