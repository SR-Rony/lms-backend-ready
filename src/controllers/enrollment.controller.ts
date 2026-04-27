import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../config/prisma";
import { error, success } from "../utils/http";

const enrollSchema = z.object({ courseId: z.string().min(1) });
const progressSchema = z.object({ progress: z.number().min(0).max(100) });

export const myEnrollments = async (req: Request, res: Response) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: req.user!.id },
    include: { course: { include: { category: true, lessons: true } } },
    orderBy: { createdAt: "desc" },
  });
  return success(res, "My courses loaded", enrollments);
};

export const enrollCourse = async (req: Request, res: Response) => {
  const { courseId } = enrollSchema.parse(req.body);
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return error(res, "Course not found", 404);

  const enrollment = await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: req.user!.id, courseId } },
    update: {},
    create: { userId: req.user!.id, courseId },
    include: { course: true },
  });

  return success(res, "Course enrolled", enrollment, 201);
};

export const updateProgress = async (req: Request, res: Response) => {
  const { progress } = progressSchema.parse(req.body);
  const enrollment = await prisma.enrollment.update({
    where: { id: req.params.id },
    data: { progress, completed: progress >= 100 },
    include: { course: true },
  });
  return success(res, "Progress updated", enrollment);
};
