import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import express from "express";
import { UserService } from "./user.service";
import { UserDto } from "../../types/user.type";
import { User } from "../../entities/User";

const userService = new UserService();

export class UserController {
  async getAllUsers(req: express.Request, res: express.Response) {
    try {
      const users: User[] = await userService.getAllUsers();
      res.json({
        success: true,
        status: 200,
        data: users,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        errMessage: "Internal Server Error",
      });
    }
  }

  async getUserById(req: express.Request, res: express.Response) {
    try {
      const userId: number = +req.params.id;
      const user: User = await userService.getUserById(userId);
      res.status(200).json({
        success: true,
        status: 200,
        data: user,
      });
    } catch (error:any) {
      res.status(404).json({
        status: 404,
        error: error.message,
        success: false
      });
    }
  }

  async createUser(req: express.Request, res: express.Response) {
    const dto: UserDto = plainToInstance(UserDto, req.body);
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
      const user: User = await userService.createUser(dto);
      res.status(201).json({
        success: true,
        status: 201,
        data: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        errMessage: "Internal Server Error",
      });
    }
  }

  async updateUser(req: express.Request, res: express.Response) {
    const dto: UserDto = plainToInstance(UserDto, req.body);
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
      const userId: number = +req.params.id;
      const user: User = await userService.updateUser(dto, userId);
      res.status(200).json({
        success: true,
        status: 200,
        data: user,
      });
    } catch (error:any) {
      res.status(404).json({
        status: 404,
        error: error.message,
        success: false
      });
    }
  }

  async deleteUser(req: express.Request, res: express.Response) {
    try {
      const userId: number = +req.params.id;
      await userService.deleteUser(userId);
      res.status(200).json();
    } catch (error:any) {
      res.status(404).json({
        status: 404,
        error: error.message,
        success: false
      });
    }
  }
}
