import { Request, Response } from "express";
import { prisma } from "../config/db";

export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const notifications = await prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      include: {
        resource: { select: { title: true } },
      },
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    await prisma.notification.updateMany({
      where: { id: Number(id), user_id: userId },
      data: { is_read: true },
    });
    res.json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notification" });
  }
};
