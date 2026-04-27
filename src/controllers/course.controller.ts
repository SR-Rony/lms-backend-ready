import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { error, success } from "../utils/http";

export const getCategories = async (_req: Request, res: Response) => {
  const categories = await prisma.category.findMany({ include: { _count: { select: { courses: true } } } });
  return success(res, "Categories loaded", categories);
};

export const getCourses = async (req: Request, res: Response) => {
  const search = String(req.query.search || "");
  const category = String(req.query.category || "");

  const courses = await prisma.course.findMany({
    where: {
      AND: [
        search ? { OR: [{ title: { contains: search } }, { description: { contains: search } }] } : {},
        category ? { category: { slug: category } } : {},
      ],
    },
    include: { category: true, lessons: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return success(res, "Courses loaded", courses);
};

export const getCourseBySlug = async (req: Request, res: Response) => {
  const course = await prisma.course.findUnique({
    where: { slug: req.params.slug },
    include: { category: true, lessons: { orderBy: { order: "asc" } } },
  });
  if (!course) return error(res, "Course not found", 404);
  return success(res, "Course details loaded", course);
};
