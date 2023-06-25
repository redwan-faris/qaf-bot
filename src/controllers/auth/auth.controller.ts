import { validate, ValidationError } from "class-validator";
import AuthService from "./auth.service";
import express from "express";
import { plainToInstance } from "class-transformer";
import { SignInDto } from "../../types/sign-in.type";
const authService: AuthService = new AuthService();
class AuthController {

  async signIn(req: express.Request, res: express.Response) {
    const dto: SignInDto = plainToInstance(SignInDto, req.body);
    const errors: ValidationError[] = await validate(dto);


    if (errors.length > 0) {
      const validationErrors: any[] = [];
      errors.forEach((error: ValidationError) => {
        const constraints = error.constraints as { [type: string]: string };
        if (constraints) {
          Object.keys(constraints).forEach((type: string) => {
            validationErrors.push({ [error.property]: constraints[type] });
          });
        }
      });

      return res.status(400).json({ status: 400, success: false, errors: validationErrors });
    }
    try {

      const user = await authService.singIn(dto);
      res.status(200).json({
        success: true,
        status: 200,
        data: user,
      });
    } catch (e: any) {
      res.status(401).json({
        success: false,
        status: 401,
        error: e.message,
      });
    }


  }

}
export default AuthController;