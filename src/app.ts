import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import courseRoutes from "./routes/course.routes";
import enrollmentRoutes from "./routes/enrollment.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import { errorHandler, notFound } from "./middlewares/error.middleware";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.appOrigin === "*" ? true : env.appOrigin, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get("/", (_req, res) => {
  res.json({ success: true, message: "LMS Backend API is running", version: "1.0.0" });
});

app.use("/api/auth", authRoutes);
app.use("/api", courseRoutes);
app.use("/api", enrollmentRoutes);
app.use("/api", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);
