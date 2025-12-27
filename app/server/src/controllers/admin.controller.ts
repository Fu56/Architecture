import { Request, Response } from "express";
import { prisma } from "../config/db";

export const getPendingResources = async (req: Request, res: Response) => {
  try {
    const resources = await prisma.resource.findMany({
      where: { status: "pending" },
      include: {
        uploader: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
            role: true,
          },
        },
        design_stage: true,
      },
      orderBy: { uploaded_at: "asc" },
    });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending resources" });
  }
};

export const approveResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resource = await prisma.resource.update({
      where: { id: Number(id) },
      data: {
        status: "approved",
        approved_at: new Date(),
      },
    });

    // Notify uploader (Optional: creates Notification record)
    if (resource.uploader_id) {
      await prisma.notification.create({
        data: {
          user_id: resource.uploader_id,
          title: "Resource Approved",
          message: `Your resource "${resource.title}" has been approved.`,
          resource_id: resource.id,
        },
      });
    }

    res.json({ message: "Resource approved", resource });
  } catch (error) {
    res.status(500).json({ message: "Error approving resource" });
  }
};

export const rejectResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; // Optional rejection reason

    const resource = await prisma.resource.update({
      where: { id: Number(id) },
      data: {
        status: "rejected",
        rejected_at: new Date(),
      },
    });

    if (resource.uploader_id) {
      await prisma.notification.create({
        data: {
          user_id: resource.uploader_id,
          title: "Resource Rejected",
          message: `Your resource "${resource.title}" was rejected. ${
            reason ? "Reason: " + reason : ""
          }`,
          resource_id: resource.id,
        },
      });
    }

    res.json({ message: "Resource rejected", resource });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting resource" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { created_at: "desc" },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const manageUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { roleId } = req.body;

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { roleId: Number(roleId) },
    });

    res.json({ message: "User role updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user role" });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalResources = await prisma.resource.count();
    const pendingResources = await prisma.resource.count({
      where: { status: "pending" },
    });
    const downloads = await prisma.resource.aggregate({
      _sum: { download_count: true },
    });

    res.json({
      totalUsers,
      totalResources,
      pendingResources,
      totalDownloads: downloads._sum.download_count || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

export const archiveResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resource = await prisma.resource.update({
      where: { id: Number(id) },
      data: { archived_at: new Date() },
    });
    res.json({ message: "Resource archived", resource });
  } catch (error) {
    res.status(500).json({ message: "Error archiving resource" });
  }
};

export const getFlags = async (req: Request, res: Response) => {
  try {
    const flags = await prisma.flag.findMany({
      where: { status: "pending" },
      include: {
        resource: { select: { title: true, id: true } },
      },
    });
    res.json(flags);
  } catch (error) {
    res.status(500).json({ message: "Error fetching flags" });
  }
};

export const resolveFlag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const { status } = req.body; // e.g. 'resolved', 'ignored'

    await prisma.flag.update({
      where: { id: Number(id) },
      data: {
        status: status || "resolved",
        resolved_at: new Date(),
        resolved_by_id: userId,
      },
    });
    res.json({ message: "Flag updated" });
  } catch (error) {
    res.status(500).json({ message: "Error resolving flag" });
  }
};
