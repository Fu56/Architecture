import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const {
      first_name,
      last_name,
      university_id,
      batch,
      year,
      semester,
      specialization,
      department,
      worker_id,
    } = req.body;

    const reqUser = (req as any).user;
    const roleName = (reqUser.role?.name || "").toLowerCase();

    // Students cannot modify academic status - only name, specialization, etc.
    const updateData: any = {
      first_name,
      last_name,
      specialization: specialization || null,
      department: department || null,
    };

    if (roleName !== "student") {
      updateData.university_id = university_id;
      updateData.batch = batch ? Number(batch) : undefined;
      updateData.year = year ? Number(year) : undefined;
      updateData.semester = semester ? Number(semester) : undefined;
      updateData.worker_id = worker_id || null;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        role: true,
      },
    });

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role?.name,
        university_id: user.university_id,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.password) {
      return res
        .status(400)
        .json({ message: "Account does not have a password configured" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect current password" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Error changing password" });
  }
};

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Fetch favorites with related resource details
    // Note: 'include' on favorite.resource needs to mirror the structure used in listResources
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        resource: {
          include: {
            uploader: {
              select: { first_name: true, last_name: true, role: true },
            },
            design_stage: true,
            ratings: { select: { rate: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedResources = favorites.map((f) => {
      const r = f.resource;
      const ratings = (r as any).ratings || [];
      const ratingCount = ratings.length;
      const averageRating =
        ratingCount > 0
          ? ratings.reduce((acc: any, curr: any) => acc + curr.rate, 0) /
            ratingCount
          : 0;

      return {
        id: r.id,
        title: r.title,
        author: r.author,
        keywords: r.keywords,
        batchYear: r.batch,
        fileType: r.file_type,
        fileSize: r.file_size,
        downloadCount: r.download_count,
        status: r.status,
        priority: !!r.priority_tag,
        uploadedAt: r.uploaded_at,
        uploader: r.uploader
          ? {
              firstName: r.uploader.first_name,
              lastName: r.uploader.last_name,
              role: r.uploader.role,
            }
          : null,
        designStage: r.design_stage,
        semester: r.semester,
        adminComment: (r as any).admin_comment,
        isFavorite: true,
        averageRating,
        ratingCount,
      };
    });

    res.json(formattedResources);
  } catch (error) {
    console.error("Get Favorites Error:", error);
    res.status(500).json({ message: "Error fetching favorites" });
  }
};

export const registerEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const eventId = Number(req.params.id);

    const event = await prisma.news.findUnique({ where: { id: eventId } });
    if (!event || !event.is_event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const existing = await prisma.eventParticipant.findUnique({
      where: { eventId_userId: { eventId, userId } }
    });

    if (existing) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    await prisma.eventParticipant.create({
      data: { eventId, userId }
    });

    res.json({ message: "Successfully registered for event" });
  } catch (error) {
    console.error("Register Event Error:", error);
    res.status(500).json({ message: "Error registering for event" });
  }
};

export const deregisterEvent = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const eventId = Number(req.params.id);

    await prisma.eventParticipant.delete({
      where: { eventId_userId: { eventId, userId } }
    });

    res.json({ message: "Successfully unregistered from event" });
  } catch (error) {
    console.error("Deregister Event Error:", error);
    res.status(500).json({ message: "Error unregistering from event" });
  }
};

export const getEventParticipants = async (req: Request, res: Response) => {
  try {
    const eventId = Number(req.params.id);

    // Verify requester has access (Faculty, Admin, DeptHead, SuperAdmin)
    const userRole = (req as any).user.role?.toLowerCase() || "";
    const secondaryRoles = (req as any).user.secondaryRoles?.map((r: any) => r.name.toLowerCase()) || [];
    const allRoles = [userRole, ...secondaryRoles];
    
    if (!allRoles.some(r => ["faculty", "admin", "departmenthead", "superadmin"].includes(r))) {
         return res.status(403).json({ message: "Access Denied: Only faculty or admins can view participants" });
    }

    const participants = await prisma.eventParticipant.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            role: true,
            batch: true,
            year: true,
          }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    res.json({ participants });
  } catch (error) {
    console.error("Get Participants Error:", error);
    res.status(500).json({ message: "Error fetching event participants" });
  }
};

