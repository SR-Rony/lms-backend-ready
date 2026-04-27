import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { success } from "../utils/http";

export const dashboard = async (req: Request, res: Response) => {
  const [enrollments, coursesCount, categories] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: req.user!.id },
      include: { course: { include: { category: true, lessons: true } } },
      take: 4,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.course.count(),
    prisma.category.findMany({ include: { _count: { select: { courses: true } } } }),
  ]);

  const averageProgress = enrollments.length
    ? Math.round(enrollments.reduce((sum, item) => sum + item.progress, 0) / enrollments.length)
    : 0;

  return success(res, "Dashboard loaded", {
    stats: {
      enrolledCourses: enrollments.length,
      totalCourses: coursesCount,
      averageProgress,
    },
    categories,
    continueLearning: enrollments[0] || null,
    myCourses: enrollments,
    upcomingLiveClass: {
      title: "IELTS Speaking Live Practice",
      startsAt: new Date(Date.now() + 86400000).toISOString(),
      teacher: "Tanvir Ahmed",
      platform: "Zoom / App Live",
    },
  });
};
