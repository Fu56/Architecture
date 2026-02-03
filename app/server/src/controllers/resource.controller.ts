import { Request, Response } from "express";
import path from "path";
import { prisma } from "../config/db";
import { notifyUsers } from "../utils/notifier";

// Helper to get user ID from request (assumes middleware populated req.user)
// You might need to extend Express Request type definition.
const getUserId = (req: Request): string | undefined => (req as any).user?.id;
const getUserRole = (req: Request): string | undefined => {
  const role = (req as any).user?.role;
  return typeof role === "object" ? role.name : role;
};

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
      design_stage_name, // New field for custom stage
      priority_tag,
      batch,
      semester,
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

    // Handle Custom Design Stage if 'others' was selected
    let finalStageId =
      design_stage_id && !isNaN(Number(design_stage_id))
        ? Number(design_stage_id)
        : null;
    if (design_stage_name && design_stage_name.trim()) {
      const existingStage = await prisma.design_stage.findFirst({
        where: {
          name: { equals: design_stage_name.trim(), mode: "insensitive" },
        },
      });
      if (existingStage) {
        finalStageId = existingStage.id;
      } else {
        const newStage = await prisma.design_stage.create({
          data: { name: design_stage_name.trim() },
        });
        finalStageId = newStage.id;
      }
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        author,
        keywords: keywordList,
        forYearStudents: Number(forYearStudents),
        semester: semester ? Number(semester) : null,
        batch: batch ? Number(batch) : null,
        file_path: file.path,
        file_type: file.mimetype, // or extension
        file_size: file.size,
        uploader_id: userId,
        design_stage_id: finalStageId,
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
    const { search, stage, year, type, status, semester, sort, sortBy, limit } =
      req.query;
    const finalSort = sort || sortBy;
    const finalLimit = limit ? Number(limit) : undefined;

    // Build filter
    const where: any = {};

    // Students should only see 'approved' usually, but this logic can be in service or here.
    // If user is Admin, they might want 'pending'.
    // Let's assume this is the public/student list.
    if (status) {
      // Security Check: Only admins/dept heads can view archived resources
      const userRole = getUserRole(req);
      const isPrivileged = [
        "Admin",
        "admin",
        "SuperAdmin",
        "DepartmentHead",
      ].includes(userRole || "");

      if (status === "archived" && !isPrivileged) {
        where.status = "student"; // Force back to public view
      } else {
        where.status = String(status);
      }
    } else {
      // Default to 'student' status
      where.status = "student";
    }

    if (stage) where.design_stage_id = Number(stage);
    if (year) where.forYearStudents = Number(year);
    if (semester) where.semester = Number(semester);
    if (type) where.file_type = { contains: String(type) };

    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: "insensitive" } },
        { author: { contains: String(search), mode: "insensitive" } },
        { keywords: { has: String(search) } }, // Postgres array filter
      ];
    }

    const orderBy: any[] = [{ priority_tag: "desc" }];

    if (finalSort === "oldest") {
      orderBy.push({ uploaded_at: "asc" });
    } else if (finalSort === "top-rated") {
      // Handled after fetching because it's a computed field
    } else if (finalSort === "downloads") {
      orderBy.push({ download_count: "desc" });
    } else {
      orderBy.push({ uploaded_at: "desc" });
    }

    const resources = await prisma.resource.findMany({
      where,
      include: {
        uploader: { select: { first_name: true, last_name: true, role: true } },
        design_stage: true,
        ratings: { select: { rate: true } },
      },
      orderBy,
      take: finalLimit,
    });

    let formattedResources = resources.map((r) => {
      const ratings = r.ratings || [];
      const ratingCount = ratings.length;
      const averageRating =
        ratingCount > 0
          ? ratings.reduce((acc, curr) => acc + curr.rate, 0) / ratingCount
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
        averageRating,
        ratingCount,
      };
    });

    if (finalSort === "top-rated") {
      formattedResources.sort((a, b) => b.averageRating - a.averageRating);
    }

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

    // Security Check: If archived, only admins can view details
    const role = getUserRole(req);
    const isPrivileged =
      role === "Admin" ||
      role === "admin" ||
      role === "SuperAdmin" ||
      role === "DepartmentHead";
    if (r.status === "archived" && !isPrivileged) {
      return res
        .status(403)
        .json({ message: "Access denied: Resource is archived" });
    }

    const ratings = r.ratings || [];
    const ratingCount = ratings.length;
    const averageRating =
      ratingCount > 0
        ? ratings.reduce((acc, curr) => acc + curr.rate, 0) / ratingCount
        : 0;

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
      averageRating,
      ratingCount,
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

    // Security Check: Archived resources only for admins
    const role = getUserRole(req);
    const isPrivileged =
      role === "Admin" ||
      role === "admin" ||
      role === "SuperAdmin" ||
      role === "DepartmentHead";
    if (resource.status === "archived" && !isPrivileged) {
      return res
        .status(403)
        .json({ message: "Access denied: Resource is archived" });
    }

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

    // Security Check: Archived resources only for admins
    const role = getUserRole(req);
    const isPrivileged =
      role === "Admin" ||
      role === "admin" ||
      role === "SuperAdmin" ||
      role === "DepartmentHead";
    if (resource.status === "archived" && !isPrivileged) {
      return res
        .status(403)
        .json({ message: "Access denied: Resource is archived" });
    }

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

    // Get resource uploader
    const resource = await prisma.resource.findUnique({
      where: { id: Number(id) },
      select: { uploader_id: true, title: true },
    });

    const comment = await prisma.comment.create({
      data: {
        text,
        resource_id: Number(id),
        user_id: userId,
      },
    });

    // Notify uploader
    if (resource?.uploader_id && resource.uploader_id !== userId) {
      await notifyUsers({
        userIds: [resource.uploader_id],
        title: "New Comment on Your Resource",
        message: `Someone commented on "${resource.title}": "${text.substring(
          0,
          50,
        )}..."`,
        resourceId: Number(id),
      });
    }

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

    // Start a transaction to ensure atomic execution
    const [rating, resource, rater] = await prisma.$transaction([
      prisma.rating.create({
        data: {
          rate: Number(rate),
          resource_id: Number(id),
          user_id: userId,
        },
      }),
      prisma.resource.findUnique({
        where: { id: Number(id) },
        include: {
          uploader: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { first_name: true, last_name: true },
      }),
    ]);

    if (resource && resource.uploader && resource.uploader.id !== userId) {
      const uploader = resource.uploader;
      const authorName =
        `${uploader.first_name || ""} ${uploader.last_name || ""}`.trim() ||
        "Architect";
      const raterName =
        `${rater?.first_name || ""} ${rater?.last_name || ""}`.trim() ||
        "A Peer User";
      const title = "New Resource Valuation";
      const message = `${raterName} rated your resource: ${resource.title}`;

      const { getRatingNotificationHtml } = require("../utils/email");
      const html = getRatingNotificationHtml(
        authorName,
        raterName,
        resource.title,
        Number(rate),
        resource.id,
      );

      await notifyUsers({
        userIds: [uploader.id],
        title,
        message,
        resourceId: resource.id,
        html,
      });
    }

    res.status(201).json(rating);
  } catch (error) {
    console.error("Rate Resource Error:", error);
    res.status(500).json({ message: "Error rating resource" });
  }
};

export const flagResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = getUserId(req); // Optional for flag?

    await (prisma.flag as any).create({
      data: {
        resource_id: Number(id),
        reason: reason,
        status: "pending",
        reporter_id: userId,
      } as any,
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
