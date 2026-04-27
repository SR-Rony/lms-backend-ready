import { Response } from "express";

export const success = (res: Response, message: string, data: unknown = null, status = 200) => {
  return res.status(status).json({ success: true, message, data });
};

export const error = (res: Response, message: string, status = 400, details: unknown = null) => {
  return res.status(status).json({ success: false, message, details });
};
