import { Request, Response, NextFunction } from "express";

export const requireRole =
  (allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // Gather all user roles (Primary + Secondary)
    const primaryRole =
      user.role?.name || (typeof user.role === "string" ? user.role : "");
    const secondaryRoles = Array.isArray(user.secondaryRoles)
      ? user.secondaryRoles.map((r: any) => r.name)
      : [];

    const allUserRoles = [primaryRole, ...secondaryRoles]
      .filter(Boolean)
      .map((r) => r.toLowerCase());

    const allowed = allowedRoles.map((r) => r.toLowerCase());

    const hasPermission = allUserRoles.some((role) => allowed.includes(role));

    if (!hasPermission) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
