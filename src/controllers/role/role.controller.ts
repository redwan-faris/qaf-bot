import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import express from "express";
import { Role } from "../../entities/Role";
import { RoleDto } from "../../types/role.type";
import { RoleService } from "./role.service";

const roleService = new RoleService();
// TODO make helper to handle response
export class RoleController {

  async getAllRoles(req: express.Request, res: express.Response) {
    try {
      const roles: Role[] = await roleService.getAllRoles();
      res.json({
        success: true,
        status: 200,
        data: roles,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        errMessage: "Internal Server Error",
      });
    }
  }

  async getRoleById(req: express.Request, res: express.Response) {
    try {
      const roleId: number = +req.params.id;
      const role: Role = await roleService.getRoleById(roleId);
      res.status(200).json({
        success: true,
        status: 200,
        data: role,
      });
    } catch (error: any) {
      res.status(404).json({
        status: 404,
        error: error.message,
        success: false
      });
    }
  }

  async createRole(req: express.Request, res: express.Response) {
    const dto: RoleDto = plainToInstance(RoleDto, req.body);
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

    try{const role: Role = await roleService.createRole(dto);
    res.status(201).json({
      success: true,
      status: 201,
      data: role,
    });}catch (error: any) {
      res.status(400).json({
        status: 400,
        error: error.message,
        success: false
      });
    }
  }

  async updateRole(req: express.Request, res: express.Response) {
    const dto: RoleDto = plainToInstance(RoleDto, req.body);
    const errors: ValidationError[] = await validate(dto);

        // TODO make helper to handle the validation
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

    const roleId: number = +req.params.id;
    try {
      const role: Role = await roleService.updateRole(dto, roleId);
      res.status(200).json({
        success: true,
        status: 200,
        data: role,
      });
    } catch (error: any) {
      res.status(404).json({
        status: 404,
        error: error.message,
        success: false
      });
    }
  }

  async deleteRole(req: express.Request, res: express.Response) {
    try {
      const roleId: number = +req.params.id;
      await roleService.deleteRole(roleId);
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
