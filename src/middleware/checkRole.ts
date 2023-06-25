import { Request, Response, NextFunction } from "express";

 
export const checkRole = (roles: Array<string>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = res.locals.jwtPayload.role;
    console.log(role)
    if (roles.indexOf(role) > -1) next();
    else res.status(401).send();
  };
};