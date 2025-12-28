import { Request, Response } from "express";
import { prisma } from "../config/db";

export const getPendingResources = async (req: Request, res: Response) => {
  try {
    const resources = await prisma.resource.findMany({
      where: { status: "pending" },
      include: {
        uploader: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
            role: true,
          },
        },
        design_stage: true,
      },
      orderBy: { uploaded_at: "asc" },
    });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending resources" });
  }
};

export const approveResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resource = await prisma.resource.update({
      where: { id: Number(id) },
      data: {
        status: "approved",
        approved_at: new Date(),
      },
    });

    // Notify uploader (Optional: creates Notification record)
    if (resource.uploader_id) {
      await prisma.notification.create({
        data: {
          user_id: resource.uploader_id,
          title: "Resource Approved",
          message: `Your resource "${resource.title}" has been approved.`,
          resource_id: resource.id,
        },
      });
    }

    res.json({ message: "Resource approved", resource });
  } catch (error) {
    res.status(500).json({ message: "Error approving resource" });
  }
};

export const rejectResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; // Optional rejection reason

    const resource = await prisma.resource.update({
      where: { id: Number(id) },
      data: {
        status: "rejected",
        rejected_at: new Date(),
      },
    });

    if (resource.uploader_id) {
      await prisma.notification.create({
        data: {
          user_id: resource.uploader_id,
          title: "Resource Rejected",
          message: `Your resource "${resource.title}" was rejected. ${
            reason ? "Reason: " + reason : ""
          }`,
          resource_id: resource.id,
        },
      });
    }

    res.json({ message: "Resource rejected", resource });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting resource" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { created_at: "desc" },
    });

    // Map to camelCase for frontend consistency
    const formattedUsers = users.map((user) => ({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      status: user.status,
      collegeId: user.college_id || "N/A", // Add fallback
      batch: user.batch,
      year: user.year,
      semester: user.semester,
      createdAt: user.created_at,
    }));

    res.json({ users: formattedUsers }); // Sending inside 'users' object as expected by frontend
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const manageUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { roleId } = req.body;

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { roleId: Number(roleId) },
    });

    res.json({ message: "User role updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user role" });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalResources = await prisma.resource.count();
    const pendingResources = await prisma.resource.count({
      where: { status: "pending" },
    });
    const downloads = await prisma.resource.aggregate({
      _sum: { download_count: true },
    });

    res.json({
      totalUsers,
      totalResources,
      pendingResources,
      totalDownloads: downloads._sum.download_count || 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

export const archiveResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resource = await prisma.resource.update({
      where: { id: Number(id) },
      data: { archived_at: new Date() },
    });
    res.json({ message: "Resource archived", resource });
  } catch (error) {
    res.status(500).json({ message: "Error archiving resource" });
  }
};

export const getFlags = async (req: Request, res: Response) => {
  try {
    const flags = await prisma.flag.findMany({
      where: { status: "pending" },
      include: {
        resource: { select: { title: true, id: true } },
      },
    });
    res.json(flags);
  } catch (error) {
    res.status(500).json({ message: "Error fetching flags" });
  }
};

export const resolveFlag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const { status } = req.body; // e.g. 'resolved', 'ignored'

    await prisma.flag.update({
      where: { id: Number(id) },
      data: {
        status: status || "resolved",
        resolved_at: new Date(),
        resolved_by_id: userId,
      },
    });
    res.json({ message: "Flag updated" });
  } catch (error) {
    res.status(500).json({ message: "Error resolving flag" });
  }
};

// Bulk register students from Excel/CSV
export const bulkRegisterStudents = async (req: Request, res: Response) => {
  try {
    const { students } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "No students provided" });
    }

    // Get Student role
    const studentRole = await prisma.role.findUnique({
      where: { name: "Student" },
    });

    if (!studentRole) {
      return res.status(500).json({ message: "Student role not found" });
    }

    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    // Process each student
    for (const student of students) {
      try {
        const {
          first_name,
          last_name,
          email,
          batch,
          year,
          semester,
          password,
        } = student;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          failedCount++;
          errors.push(`${email}: Already registered`);
          continue;
        }

        // Use provided password or generate default
        const bcrypt = require("bcryptjs");
        const finalPassword =
          password || `Student${Math.floor(Math.random() * 10000)}`;
        const hashedPassword = await bcrypt.hash(finalPassword, 10);

        // Create user
        await prisma.user.create({
          data: {
            first_name,
            last_name,
            email,
            password: hashedPassword,
            roleId: studentRole.id,
            status: "active",
            batch: batch ? Number(batch) : null,
            year: year ? Number(year) : null,
            semester: semester ? Number(semester) : null,
            college_id: email.split("@")[0].toUpperCase(), // Simple generation of ID from email prefix
          },
        });

        successCount++;
        console.log(
          `Student registered: ${email}, Password: ${
            password ? "[PROVIDED]" : finalPassword
          }`
        );
      } catch (err) {
        failedCount++;
        errors.push(`${student.email}: Registration failed`);
      }
    }

    res.json({
      message: "Bulk registration completed",
      success: successCount,
      failed: failedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Bulk registration error:", error);
    res.status(500).json({ message: "Error during bulk registration" });
  }
};

// Register individual faculty member
export const registerFaculty = async (req: Request, res: Response) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      department,
      specialization,
    } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Get Faculty role
    const facultyRole = await prisma.role.findUnique({
      where: { name: "Faculty" },
    });

    if (!facultyRole) {
      return res.status(500).json({ message: "Faculty role not found" });
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        roleId: facultyRole.id,
        status: "active",
      },
      include: {
        role: true,
      },
    });

    // TODO: Store department and specialization if you have a faculty profile table

    res.status(201).json({
      message: "Faculty member registered successfully",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role?.name,
      },
    });
  } catch (error) {
    console.error("Faculty registration error:", error);
    res.status(500).json({ message: "Error registering faculty member" });
  }
};
