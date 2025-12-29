import { Request, Response } from "express";
import path from "path";
import { prisma } from "../config/db";

// Helper to get user ID from request (assumes middleware populated req.user)
// You might need to extend Express Request type definition.
const getUserId = (req: Request): number | undefined => (req as any).user?.id;
const getUserRole = (req: Request): string | undefined =>
  (req as any).user?.role;

export const createResource = async (req: Request, res: Response) => {
  try {
    const file = (req as any).file;
    if (!file) return res.status(400).json({ message: "File is required" });

    const {
      title,
      author,
      keywords,
      forYearStudents,
      design_stage_id,
      priority_tag,
      batch,
    } = req.body;
    const userId = getUserId(req);

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Parse keywords (comma separated string -> array)
    const keywordList = keywords
      ? keywords.split(",").map((k: string) => k.trim())
      : [];

    // Determine status: Faculty might auto-approve? Or Admins?
    // For now, default to pending for everyone unless specified logic exists.
    // User requested: "Faculty - Same as students but with priority tags".
    // "Administrator - Approve or reject".
    const status = "pending";

    // Check if user is Faculty to set priority_tag if not provided
    let finalPriorityTag = priority_tag;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });
    if (user?.role?.name === "Faculty" && !finalPriorityTag) {
      finalPriorityTag = "Faculty Upload";
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        author,
        keywords: keywordList,
        forYearStudents: Number(forYearStudents),
        batch: batch ? Number(batch) : null,
        file_path: file.path,
        file_type: file.mimetype, // or extension
        file_size: file.size,
        uploader_id: userId,
        design_stage_id: design_stage_id ? Number(design_stage_id) : null,
        status: status,
        priority_tag: finalPriorityTag,
        download_count: 0,
      },
    });

    res.status(201).json({
      id: resource.id,
      title: resource.title,
      author: resource.author,
      keywords: resource.keywords,
      batchYear: resource.batch,
      fileType: resource.file_type,
      fileSize: resource.file_size,
      status: resource.status,
      uploadedAt: resource.uploaded_at,
    });
  } catch (error) {
    console.error("Create Resource Error:", error);
    res.status(500).json({ message: "Failed to upload resource" });
  }
};

export const listResources = async (req: Request, res: Response) => {
  try {
    const { search, stage, year, type, status } = req.query;

    // Build filter
    const where: any = {};

    // Students should only see 'approved' usually, but this logic can be in service or here.
    // If user is Admin, they might want 'pending'.
    // Let's assume this is the public/student list.
    if (status) {
      where.status = String(status);
    } else {
      // Default to 'student' status as requested
      where.status = "student";
    }

    if (stage) where.design_stage_id = Number(stage);
    if (year) where.forYearStudents = Number(year);
    if (type) where.file_type = { contains: String(type) };

    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: "insensitive" } },
        { author: { contains: String(search), mode: "insensitive" } },
        { keywords: { has: String(search) } }, // Postgres array filter
      ];
    }

    const resources = await prisma.resource.findMany({
      where,
      include: {
        uploader: { select: { first_name: true, last_name: true, role: true } },
        design_stage: true,
      },
      orderBy: [{ priority_tag: "desc" }, { uploaded_at: "desc" }],
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
      adminComment: (r as any).admin_comment,
    }));

    res.json(formattedResources);
  } catch (error) {
    console.error("List Resources Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const r = await prisma.resource.findUnique({
      where: { id: Number(id) },
      include: {
        uploader: { select: { first_name: true, last_name: true, role: true } },
        design_stage: true,
        comments: {
          include: {
            user: { select: { first_name: true, last_name: true, role: true } },
          },
          orderBy: { created_at: "desc" },
        },
        ratings: true,
      },
    });

    if (!r) return res.status(404).json({ message: "Resource not found" });

    const formattedResource = {
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
      adminComment: (r as any).admin_comment,
      comments: r.comments.map((c) => ({
        id: c.id,
        text: c.text,
        createdAt: c.created_at,
        user: {
          firstName: c.user.first_name,
          lastName: c.user.last_name,
          role: c.user.role,
        },
      })),
      ratings: r.ratings,
    };

    res.json(formattedResource);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const downloadResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resource = await prisma.resource.findUnique({
      where: { id: Number(id) },
    });

    if (!resource)
      return res.status(404).json({ message: "Resource not found" });

    // Increment count
    await prisma.resource.update({
      where: { id: Number(id) },
      data: { download_count: { increment: 1 } },
    });

    // Send file
    res.download(resource.file_path, resource.title); // Ensure title is safe or use fallback
  } catch (error) {
    console.error("Download Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const viewResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resource = await prisma.resource.findUnique({
      where: { id: Number(id) },
    });

    if (!resource)
      return res.status(404).json({ message: "Resource not found" });

    // Send file for viewing in browser (no download header)
    res.sendFile(path.resolve(resource.file_path));
  } catch (error) {
    console.error("View Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // resourceId
    const { text } = req.body;
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const comment = await prisma.comment.create({
      data: {
        text,
        resource_id: Number(id),
        user_id: userId,
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment" });
  }
};

export const rateResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rate } = req.body;
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const rating = await prisma.rating.create({
      data: {
        rate: Number(rate),
        resource_id: Number(id),
        user_id: userId,
      },
    });
    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ message: "Error rating resource" });
  }
};

export const flagResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = getUserId(req); // Optional for flag?

    await prisma.flag.create({
      data: {
        resource_id: Number(id),
        reason: reason,
        status: "pending",
      },
    });

    // Also update flag boolean on resource for quick check?
    await prisma.resource.update({
      where: { id: Number(id) },
      data: { flag: true },
    });

    res.status(200).json({ message: "Resource flagged" });
  } catch (error) {
    res.status(500).json({ message: "Error flagging resource" });
  }
};
