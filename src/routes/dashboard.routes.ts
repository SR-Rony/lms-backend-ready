import { Router } from "express";
import { dashboard } from "../controllers/dashboard.controller";
import { authRequired } from "../middlewares/auth.middleware";

const router = Router();
router.get("/dashboard", authRequired, dashboard);
export default router;
