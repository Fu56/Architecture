import { Request, Response, NextFunction } from "express";

export const requireRole =
  (allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // precise match or loose match? Let's do case-insensitive match
    const userRole = user.role?.toLowerCase();
    const allowed = allowedRoles.map((r) => r.toLowerCase());

    if (!userRole || !allowed.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
