import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { env } from "../config/env";
import { error, success } from "../utils/http";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signToken = (user: { id: string; email: string; role: string }) =>
  jwt.sign(user, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"] });

const safeUser = (user: any) => {
  const { password, ...rest } = user;
  return rest;
};

export const register = async (req: Request, res: Response) => {
  const body = registerSchema.parse(req.body);
  const exists = await prisma.user.findFirst({ where: { OR: [{ email: body.email }, ...(body.phone ? [{ phone: body.phone }] : [])] } });
  if (exists) return error(res, "User already exists", 409);

  const password = await bcrypt.hash(body.password, 12);
  const user = await prisma.user.create({ data: { ...body, password } });
  const token = signToken({ id: user.id, email: user.email, role: user.role });

  return success(res, "Registration successful", { user: safeUser(user), token }, 201);
};

export const login = async (req: Request, res: Response) => {
  const body = loginSchema.parse(req.body);
  console.log('login data',body);
  
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user) return error(res, "Invalid email or password", 401);

  const ok = await bcrypt.compare(body.password, user.password);
  if (!ok) return error(res, "Invalid email or password", 401);

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return success(res, "Login successful", { user: safeUser(user), token });
};

export const me = async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
  if (!user) return error(res, "User not found", 404);
  return success(res, "Profile loaded", safeUser(user));
};
