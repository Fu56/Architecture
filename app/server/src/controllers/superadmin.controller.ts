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
