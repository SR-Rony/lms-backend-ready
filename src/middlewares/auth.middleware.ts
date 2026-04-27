import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { error } from "../utils/http";

export const authRequired = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return error(res, "Unauthorized", 401);

  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(token, env.jwtSecret) as Express.Request["user"];
    next();
  } catch {
    return error(res, "Invalid or expired token", 401);
  }
};
