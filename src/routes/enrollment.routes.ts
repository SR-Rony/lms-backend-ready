import { Router } from "express";
import { enrollCourse, myEnrollments, updateProgress } from "../controllers/enrollment.controller";
import { authRequired } from "../middlewares/auth.middleware";

const router = Router();
router.use(authRequired);
router.get("/my-courses", myEnrollments);
router.post("/enroll", enrollCourse);
router.patch("/progress/:id", updateProgress);
export default router;
