import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { prisma } from "../config/db";
import {
  updateProfile,
  changePassword,
  getFavorites,
} from "../controllers/user.controller";

const router = Router();

// Get the logged-in user's uploads
router.get("/resources", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const resources = await prisma.resource.findMany({
      where: { uploader_id: userId },
      include: {
        uploader: { select: { first_name: true, last_name: true, role: true } },
        design_stage: true,
      },
      orderBy: { uploaded_at: "desc" },
    });

    const formattedResources = resources.map((r) => ({
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
    }));

    res.json(formattedResources);
  } catch (error) {
    console.error("Fetch User Resources Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/profile", requireAuth, updateProfile);
router.patch("/change-password", requireAuth, changePassword);
router.get("/favorites", requireAuth, getFavorites);

export default router;
