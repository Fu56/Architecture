import { Request, Response } from "express";
import { prisma } from "../config/db";

const getUserId = (req: Request): number | undefined => (req as any).user?.id;

export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, tags, published } = req.body;
    const userId = getUserId(req);
    const file = (req as any).file;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // Assuming we want to restrict to Faculty/Admin, checked by middleware or here
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });
    const allowedRoles = ["Faculty", "Admin", "SuperAdmin"];
    if (!allowedRoles.includes(user?.role?.name || "")) {
      return res
        .status(403)
        .json({ message: "Forbidden: Only Faculty and Admin can post blogs." });
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        published: published === "true" || published === true,
        tags: tags
          ? Array.isArray(tags)
            ? tags
            : tags.split(",").map((t: string) => t.trim())
          : [],
        image_path: file ? file.path : null,
        author_id: userId,
      },
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error("Create Blog Error:", error);
    res.status(500).json({ message: "Failed to create blog post" });
  }
};

export const listBlogs = async (req: Request, res: Response) => {
  try {
    const { published } = req.query;
    const where: any = {};

    // If asking for published only (or public view), filter.
    // If admin looking at dashboard, might want all.
    if (published === "true") {
      where.published = true;
    }

    const blogs = await prisma.blog.findMany({
      where,
      include: {
        author: {
          select: { first_name: true, last_name: true, role: true },
        },
      },
      orderBy: { created_at: "desc" },
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};

export const getBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await prisma.blog.findUnique({
      where: { id: Number(id) },
      include: {
        author: {
          select: { first_name: true, last_name: true, role: true },
        },
      },
    });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blog" });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, tags, published } = req.body;
    const userId = getUserId(req);

    const blog = await prisma.blog.findUnique({ where: { id: Number(id) } });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check ownership or admin
    if (blog.author_id !== userId) {
      // Double check if admin
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true },
      });
      if (user?.role?.name !== "Admin" && user?.role?.name !== "SuperAdmin") {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    const updated = await prisma.blog.update({
      where: { id: Number(id) },
      data: {
        title: title || undefined,
        content: content || undefined,
        published:
          published !== undefined
            ? published === "true" || published === true
            : undefined,
        tags: tags
          ? Array.isArray(tags)
            ? tags
            : tags.split(",").map((t: string) => t.trim())
          : undefined,
      },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating blog" });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    const blog = await prisma.blog.findUnique({ where: { id: Number(id) } });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check ownership or admin
    if (blog.author_id !== userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { role: true },
      });
      if (user?.role?.name !== "Admin" && user?.role?.name !== "SuperAdmin") {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    await prisma.blog.delete({ where: { id: Number(id) } });
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog" });
  }
};
