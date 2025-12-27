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
