import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { error } from "../utils/http";

export const notFound = (_req: Request, res: Response) => error(res, "Route not found", 404);

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) return error(res, "Validation error", 422, err.flatten());
  console.error(err);
  return error(res, "Internal server error", 500);
};
