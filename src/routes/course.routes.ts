import { Router } from "express";
import { getCategories, getCourseBySlug, getCourses } from "../controllers/course.controller";

const router = Router();
router.get("/categories", getCategories);
router.get("/courses", getCourses);
router.get("/courses/:slug", getCourseBySlug);
export default router;
