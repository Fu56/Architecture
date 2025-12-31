import { Request, Response } from "express";
import { prisma } from "../config/db";

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching roles" });
  }
};

export const getDesignStages = async (req: Request, res: Response) => {
  try {
    const stages = await prisma.design_stage.findMany({
      orderBy: { id: "asc" },
    });
    res.json(stages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching design stages" });
  }
};

export const getPublicStats = async (req: Request, res: Response) => {
  try {
    const totalResources = await prisma.resource.count({
      where: { status: "student" },
    });
    const totalUsers = await prisma.user.count();
    const downloads = await prisma.resource.aggregate({
      _sum: { download_count: true },
    });
    const facultyCount = await prisma.user.count({
      where: { role: { name: "Faculty" } },
    });

    res.json({
      totalResources,
      totalUsers,
      totalDownloads: downloads._sum.download_count || 0,
      facultyCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};
