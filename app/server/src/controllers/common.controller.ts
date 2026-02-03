import { Request, Response } from "express";
import { prisma } from "../config/db";
import {
  sendNotificationEmail,
  getNewsletterSubscriptionHtml,
  getNewsletterAdminAlertHtml,
} from "../utils/email";

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: "Error fetching roles" });
  }
};

// ... (getDesignStages, getPublicStats, getAllNews - unchanged)

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

export const getAllNews = async (req: Request, res: Response) => {
  try {
    const news = await prisma.news.findMany({
      where: { published: true },
      orderBy: { created_at: "desc" },
    });

    // Format for frontend
    const formattedNews = news.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      source: item.source,
      isEvent: item.is_event,
      eventDate: item.event_date,
      createdAt: item.created_at,
      time: new Date(item.created_at).toLocaleDateString(), // Simplistic for now
    }));

    res.json(formattedNews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching news" });
  }
};

export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Check if already subscribed
    const existing = await (prisma as any).newsletterSubscription.findUnique({
      where: { email },
    });

    if (existing) {
      return res
        .status(200)
        .json({ message: "You are already subscribed to the nexus." });
    }

    await (prisma as any).newsletterSubscription.create({
      data: { email },
    });

    // 1. Notify Subscriber with Thank You Message
    await sendNotificationEmail(
      email,
      "Welcome to the Architectural Matrix",
      "Thank you for subscribing to the Architectural Matrix newsletter.",
      getNewsletterSubscriptionHtml(email),
    );

    // 2. Notify SuperAdmins and Dept Heads
    const admins = await prisma.user.findMany({
      where: {
        role: {
          name: { in: ["SuperAdmin", "DepartmentHead"] },
        },
      },
      select: { email: true },
    });

    for (const admin of admins) {
      if (admin.email) {
        await sendNotificationEmail(
          admin.email,
          "New Registry Subscription",
          `A new entity (${email}) has subscribed to the network.`,
          getNewsletterAdminAlertHtml(email),
        );
      }
    }

    res.json({
      message: "Transmission initialized. Welcome to the studio digest.",
    });
  } catch (error) {
    console.error("Newsletter Subscription Error:", error);
    res.status(500).json({
      message: "Internal server error. Failed to initialize transmission.",
    });
  }
};
