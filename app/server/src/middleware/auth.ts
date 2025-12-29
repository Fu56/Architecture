import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthUser {
  id: number;
  email: string;
  role?: string;
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const queryToken = req.query.token as string;

  let token = "";
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (queryToken) {
    token = queryToken;
  }

  if (!token || token === "null" || token === "undefined") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(token, env.jwtSecret) as any;
    (req as any).user = {
      id: Number(payload.id),
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
