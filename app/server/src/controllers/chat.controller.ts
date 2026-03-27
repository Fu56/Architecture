// cSpell:ignore departmenthead
import { Request, Response } from "express";
import { prisma } from "../config/db";

const getRoleName = (user: any) => {
    if (!user?.role) return "";
    return (typeof user.role === "string" ? user.role : user.role.name || "").toLowerCase();
};

export const getChannels = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user.id;
    const userBatch = user.batch;
    const role = getRoleName(user);
    
    let where: any = {
      OR: [
        { isPublic: true },
        { subscribers: { some: { id: userId } } }
      ]
    };

    // If student, also include their batch channel
    if (role === "student" && userBatch) {
       (where.OR as any[]).push({ batch: userBatch });
    }

    // Staff/Admins see all channels
    if (["admin", "departmenthead", "superadmin", "faculty"].includes(role)) {
       where = {};
    }

    let channels = await prisma.chatChannel.findMany({
      where,
      include: {
        designStage: true,
        subscribers: {
          select: { id: true }
        },
        _count: {
          select: { messages: true }
        },
        messages: {
          select: {
            id: true,
            readBy: {
              where: { userId }
            }
          }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    const formatted = channels.map(c => {
      const totalMessages = c._count.messages;
      const readMessages = c.messages.filter(m => m.readBy.length > 0).length;
      const unreadCount = totalMessages - readMessages;

      return {
        ...c,
        messages: undefined, // Clear messages to keep payload compact
        unreadCount,
        isSubscribed: c.subscribers.some(s => s.id === userId)
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error("Fetch Channels Error:", error);
    res.status(500).json({ message: "Failed to retrieve Nexus nodes." });
  }
};

export const markMessagesRead = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;
    const userId = (req as any).user.id;

    // Find all messages in this channel not yet read by this user
    const unreadMessages = await prisma.chatMessage.findMany({
      where: {
        channelId: Number(channelId),
        NOT: {
          readBy: {
            some: { userId }
          }
        }
      },
      select: { id: true }
    });

    if (unreadMessages.length > 0) {
      await prisma.chatMessageRead.createMany({
        data: unreadMessages.map(m => ({
          messageId: m.id,
          userId
        })),
        skipDuplicates: true
      });
    }

    res.json({ message: "Nexus signal synchronization complete." });
  } catch (error) {
    res.status(500).json({ message: "Failed to synchronize signal reads." });
  }
};

export const markAllRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Find all messages in any channel not yet read by this user
    const unreadMessages = await prisma.chatMessage.findMany({
      where: {
        NOT: {
          readBy: {
            some: { userId }
          }
        }
      },
      select: { id: true }
    });

    if (unreadMessages.length > 0) {
      await prisma.chatMessageRead.createMany({
        data: unreadMessages.map(m => ({
          messageId: m.id,
          userId
        })),
        skipDuplicates: true
      });
    }

    res.json({ message: "Global Nexus synchronization complete." });
  } catch (error) {
    res.status(500).json({ message: "Global synchronization sequence failed." });
  }
};

export const getChannelMembers = async (req: Request, res: Response) => {
    try {
      const { channelId } = req.params;
      
      const channel = await prisma.chatChannel.findUnique({
        where: { id: Number(channelId) },
        include: {
          subscribers: {
            select: { id: true, first_name: true, last_name: true, role: true, image: true, email: true }
          }
        }
      });
  
      res.json(channel?.subscribers || []);
    } catch (error) {
      res.status(500).json({ message: "Failed to load participant list." });
    }
};

export const subscribeChannel = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;
    const userId = (req as any).user.id;

    await prisma.chatChannel.update({
      where: { id: Number(channelId) },
      data: {
        subscribers: { connect: { id: userId } }
      }
    });

    res.json({ message: "Satellite link established. Subscription confirmed." });
  } catch (error) {
    res.status(500).json({ message: "Subscription protocols failed." });
  }
};

export const unsubscribeChannel = async (req: Request, res: Response) => {
    try {
      const { channelId } = req.params;
      const userId = (req as any).user.id;
  
      await prisma.chatChannel.update({
        where: { id: Number(channelId) },
        data: {
          subscribers: { disconnect: { id: userId } }
        }
      });
  
      res.json({ message: "Link severed. Unsubscribed." });
    } catch (error) {
      res.status(500).json({ message: "De-link protocols failed." });
    }
};

export const addUserToChannel = async (req: Request, res: Response) => {
    try {
      const { channelId } = req.params;
      const { targetUserId } = req.body;
      
      await prisma.chatChannel.update({
        where: { id: Number(channelId) },
        data: {
          subscribers: { connect: { id: targetUserId } }
        }
      });
  
      res.json({ message: "User node synchronized to channel." });
    } catch (error) {
      res.status(500).json({ message: "Failed to add target user to nexus." });
    }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;
    
    const messages = await prisma.chatMessage.findMany({
      where: { channelId: Number(channelId) },
      include: {
        user: {
          select: { id: true, first_name: true, last_name: true, role: true, image: true }
        },
        attachments: true
      },
      orderBy: { createdAt: "asc" },
      take: 100
    });

    res.json(messages);
  } catch (error) {
    console.error("Fetch Messages Error:", error);
    res.status(500).json({ message: "Failed to load communal transcripts" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;
    const { content } = req.body;
    const userId = (req as any).user.id;
    const file = req.file;

    if (!content && !file) return res.status(400).json({ message: "Empty transmission blocked" });

    const message = await prisma.chatMessage.create({
      data: {
        content: content || null,
        userId,
        channelId: Number(channelId),
        ...(file ? {
          attachments: {
            create: {
              fileUrl: `/uploads/${file.filename}`,
              fileType: file.mimetype,
              fileName: file.originalname
            }
          }
        } : {}),
        readBy: {
          create: { userId }
        }
      },
      include: {
        user: {
          select: { id: true, first_name: true, last_name: true, role: true, image: true }
        },
        attachments: true
      }
    });

    await prisma.chatChannel.update({
      where: { id: Number(channelId) },
      data: { updatedAt: new Date() }
    });

    res.json(message);
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ message: "Nexus communication failure" });
  }
};

export const createChannel = async (req: Request, res: Response) => {
    try {
        const { name, batch, designStageId, isPublic } = req.body;
        
        // Identity Validation
        if (!name || name.trim().length < 3) {
            return res.status(400).json({ message: "Channel identity must be at least 3 characters." });
        }

        const trimmedName = name.trim();

        // Duplicate Check
        const existing = await prisma.chatChannel.findFirst({
            where: { name: trimmedName }
        });

        if (existing) {
            return res.status(400).json({ message: "This channel identity is already active in the Nexus." });
        }

        // Batch Validation (optional but limited to 1-5)
        if (batch && (Number(batch) < 1 || Number(batch) > 5)) {
            return res.status(400).json({ message: "Target batch must be between Year 1 and 5." });
        }

        const channel = await prisma.chatChannel.create({
            data: {
                name: trimmedName,
                batch: batch ? Number(batch) : null,
                designStageId: designStageId ? Number(designStageId) : null,
                isPublic: !!isPublic
            }
        });
        
        res.status(201).json(channel);
    } catch (error) {
        console.error("Channel Creation Error:", error);
        res.status(500).json({ message: "Failed to initialize channel node. Verification sequence failed." });
    }
};

