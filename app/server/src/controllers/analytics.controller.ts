import { Request, Response } from "express";
import { prisma } from "../config/db";

export const stats = async (_req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalResources = await prisma.resource.count({
      where: { archived_at: null },
    });
    const pendingResources = await prisma.resource.count({
      where: { status: "pending" },
    });
    const downloads = await prisma.resource.aggregate({
      _sum: { download_count: true },
    });

    const mostDownloaded = await prisma.resource.findMany({
      where: { status: "student", archived_at: null },
      orderBy: { download_count: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        download_count: true,
        file_type: true,
      },
    });

    res.json({
      totalUsers,
      totalResources,
      pendingResources,
      totalDownloads: downloads._sum.download_count || 0,
      mostDownloaded,
    });
  } catch (error) {
    console.error("Analytics stats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
