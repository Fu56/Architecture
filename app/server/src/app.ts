import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { env } from "./config/env";

import authRoutes from "./routes/auth.route";
import resourceRoutes from "./routes/resource.route";
import adminRoutes from "./routes/admin.routes";
import analyticsRoutes from "./routes/analytics.routes";
import commonRoutes from "./routes/common.routes";
import notificationRoutes from "./routes/notification.routes";
import userRoutes from "./routes/user.routes";
import assignmentRoutes from "./routes/assignment.route";
import blogRoutes from "./routes/blog.route";

export const app = express();

// Add this before your other routes in src/app.ts
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Digital Library API" });
});

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.resolve(env.uploadDir)));
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/common", commonRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/user", userRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/blogs", blogRoutes);

// Simple ping
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Global Error Handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Global Error:", err);
    res.status(err.status || 500).json({
      message: err.message || "Internal server error",
    });
  }
);
