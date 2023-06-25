import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  const token = <string>req.headers.authorization?.substring(7);
 
  let jwtPayload;

  try {
    jwtPayload = <any>jwt.verify(token, "config.jwtSecret");
    res.locals.jwtPayload = jwtPayload;

    const { userId, username ,role} = jwtPayload;
    const newToken = jwt.sign({ userId, username ,role}, "config.jwtSecret");
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
