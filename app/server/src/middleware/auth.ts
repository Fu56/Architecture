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
  next: NextFunction,
) => {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userStatus = (session.user as any).status;

    if (userStatus && userStatus !== "active") {
      return res.status(403).json({
        message:
          "Access Denied: Your account node is not fully authorized or has been suspended.",
      });
    }

    // Attach user info to request
    (req as any).user = {
      id: session.user.id,
      email: session.user.email,
      role: (session.user as any).role?.name,
      status: userStatus,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Invalid session" });
  }
};
