import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = <string>req.headers.authorization?.substring(7);
 
  let jwtPayload;

  try {
    jwtPayload = <any>jwt.verify(token,    process.env.JWT_SECRET as string);
    res.locals.jwtPayload = jwtPayload;

    const { userId, username ,role} = jwtPayload;
    const newToken = jwt.sign({ userId, username ,role},     process.env.JWT_SECRET as string);
    res.setHeader("token", newToken);

    next();
  } catch (error) { 
    res.status(401).json({
      message: "Unauthorized",
      success: false,
      status: 401,
    });
  }
};
