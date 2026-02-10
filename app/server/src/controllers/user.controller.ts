import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../config/db";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { first_name, last_name, university_id } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        first_name,
        last_name,
        university_id,
      },
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
