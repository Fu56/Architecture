import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Attach user info to request
    (req as any).user = {
      id: session.user.id,
      email: session.user.email,
      role: (session.user as any).role?.name,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Invalid session" });
  }
};
