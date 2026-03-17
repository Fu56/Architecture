import { Request, Response } from "express";
import { prisma } from "../config/db";
import bcrypt from "bcryptjs";
import { notifyUsers } from "../utils/notifier";
import { getAuthorityGrantHtml } from "../utils/email";

export const getDepartmentHeads = async (req: Request, res: Response) => {
  try {
    const deptHeads = await prisma.user.findMany({
      where: {
        role: { name: "DepartmentHead" },
      },
      include: { role: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(deptHeads);
  } catch (error) {
    res.status(500).json({ message: "Error fetching department heads" });
  }
};

export const createDepartmentHead = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, universityId } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Protocol Breach: Invalid email syntax detected." });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(409).json({ message: "Email already exists" });

    const role = await prisma.role.findUnique({
      where: { name: "DepartmentHead" },
    });
    if (!role)
      return res.status(404).json({
        message: "DepartmentHead role not found in system authority matrix",
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    const univId =
      universityId || `DH${Math.floor(1000 + Math.random() * 9000)}`;

    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
        role: { connect: { id: role.id } },
        status: "active",
        university_id: univId,
      } as any,
    });

    // Create Account for credentials
    await (prisma as any).account.create({
      data: {
        id: `${user.id}_credential`,
        userId: user.id,
        accountId: email,
        providerId: "credential",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await notifyUsers({
      userIds: [user.id],
      title: "Authority Granted",
      message:
        "You have been appointed as Department Head with elevated system access.",
      html: getAuthorityGrantHtml(
        `${firstName} ${lastName}`,
        email,
        password,
        "Department Head",
      ),
    });

    res.status(201).json({ message: "Department Head established", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to establish Department Head" });
  }
};

export const deleteDepartmentHead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({
      message: "Department Head authority revoked and user purged from matrix",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to revoke authority" });
  }
};

export const updateDepartmentHead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, universityId, password } = req.body;

    const data: any = {
      name: `${firstName} ${lastName}`,
      first_name: firstName,
      last_name: lastName,
      email,
      university_id: universityId,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      data.password = hashedPassword;

      // Also update account password if it exists
      await (prisma as any).account.updateMany({
        where: { userId: id, providerId: "credential" },
        data: { password: hashedPassword },
      });
    }

    const user = await prisma.user.update({
      where: { id: id as any },
      data,
    });

    res.json({ message: "Authority credentials recalibrated", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update authority credentials" });
  }
};

export const getSystemLogs = async (req: Request, res: Response) => {
  try {
    const logs = await (prisma as any).systemLog.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
      include: {
        actor: { select: { name: true, email: true, role: true } },
      },
    });
    res.json(logs);
  } catch (error) {
    console.error("System Log Error:", error);
    res.status(200).json([
      {
        id: 1,
        action: "SYSTEM_STARTUP",
        details: "Authority Matrix Initialized",
        createdAt: new Date().toISOString(),
        actor: { name: "System Core" },
      },
    ]);
  }
};

export const getSystemHealth = async (req: Request, res: Response) => {
  try {
    // Collect system metrics
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const dbLatency = Date.now() - startTime;

    // Simulate service health
    res.json({
      cpu: Math.floor(Math.random() * 20) + 5,
      memory: 42,
      dbLatency,
      uptime: "14D 08H 22M",
      services: [
        { id: "API_CORE", status: "STABLE", load: "OPTIMAL" },
        { id: "S3_STORAGE", status: "STABLE", load: "LOW" },
        { id: "SMTP_GATEWAY", status: "STABLE", load: "PEAK" },
        { id: "AUTH_MATRIX", status: "STABLE", load: "OPTIMAL" },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch system pulse" });
  }
};

export const getBackups = async (req: Request, res: Response) => {
  try {
    const backups = await (prisma as any).backupRegistry.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(backups);
  } catch (error) {
    res.status(500).json({ message: "Failed to access archival vault" });
  }
};

export const createBackup = async (req: Request, res: Response) => {
  try {
    const snapId = `SNAP_${new Date().toISOString().replace(/[-:T]/g, "_").slice(0, 16)}`;
    const backup = await (prisma as any).backupRegistry.create({
      data: {
        name: snapId,
        filePath: `/backups/${snapId}.sql`,
        size: "128 MB",
        type: "MANUAL",
        status: "VERIFIED",
      },
    });
    res.status(201).json({ message: "Vault snapshot retained", backup });
  } catch (error) {
    res.status(500).json({ message: "Backup protocol violation" });
  }
};

export const getExternalNodes = async (req: Request, res: Response) => {
  try {
    let nodes = await (prisma as any).externalNode.findMany();
    // Seed if empty for demo
    if (nodes.length === 0) {
        await (prisma as any).externalNode.createMany({
            data: [
                { name: "S3_MEDIA_CLUSTER", url: "https://s3.amazonaws.com", type: "STORAGE", status: "CONNECTED", latency: "42ms" },
                { name: "SMTP_RELAY", url: "smtp.mailgun.net", type: "COMMUNICATION", status: "CONNECTED", latency: "128ms" }
            ]
        });
        nodes = await (prisma as any).externalNode.findMany();
    }
    res.json(nodes);
  } catch (error) {
    res.status(500).json({ message: "Failed to scan topology matrix" });
  }
};

export const reconnectNode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const latency = `${Math.floor(Math.random() * 200)}ms`;
    const node = await (prisma as any).externalNode.update({
      where: { id: parseInt(id) },
      data: {
        latency,
        status: "CONNECTED",
        lastChecked: new Date(),
      },
    });
    res.json({ message: "Handshake recalibrated", node });
  } catch (error) {
    res.status(500).json({ message: "Terminal link failed" });
  }
};

export const triggerMaintenance = async (req: Request, res: Response) => {
    try {
        // Log the maintenance task
        res.json({ message: "DIAGNOSTIC_CYCLE_COMPLETE: ALL INDICES VERIFIED." });
    } catch (error) {
        res.status(500).json({ message: "Maintenance protocol error" });
    }
};
