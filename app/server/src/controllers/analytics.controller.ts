import { Request, Response } from "express";
import { prisma } from "../config/db";

export const stats = async (_req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalResources = await prisma.resource.count({
      where: { archived_at: null },
    });
    const mostDownloaded = await prisma.resource.findMany({
      where: { status: "student", archived_at: null },
      orderBy: { download_count: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        download_count: true,
        file_type: true,
      },
    });
    res.json({ totalUsers, totalResources, mostDownloaded });
  } catch (error) {
    console.error("Analytics stats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
