import { Request, Response } from "express";
import { prisma } from "../config/db";

export const getPendingResources = async (req: Request, res: Response) => {
  try {
    const resources = await prisma.resource.findMany({
      where: { status: "pending" },
      include: {
        uploader: {
          select: {
            id: true,
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
    const formattedResources = resources.map((resource) => ({
      id: resource.id,
      title: resource.title,
      author: resource.author,
      keywords: resource.keywords,
      batchYear: resource.batch, // Note: Schema has 'batch' (Int?), Model has 'batchYear' (number?) - mapping might need adjustment based on intention, assuming batch
      filePath: resource.file_path,
      fileType: resource.file_type,
      fileSize: resource.file_size,
      uploader: {
        id: resource.uploader?.id, // specific select didn't include ID, but include: { uploader: ... } typically returns object. Wait, select was specific.
        // The select in findMany was:
        // uploader: { select: { email: true, first_name: true, last_name: true, role: true } }
        // So ID is NOT returned. The frontend Resource interface expects a full User object (with ID).
        // I should update the select to include ID or map carefully.
        firstName: resource.uploader?.first_name,
        lastName: resource.uploader?.last_name,
        email: resource.uploader?.email,
        role: resource.uploader?.role,
      },
      designStage: resource.design_stage,
      status: resource.status,
      downloadCount: resource.download_count,
      isArchived: resource.archived_at ? true : false,
      priority: resource.priority_tag ? true : false,
      uploadedAt: resource.uploaded_at,
    }));
    res.json(formattedResources);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending resources" });
  }
};

export const approveResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { comment } = req.body; // Optional approval comment

    const resource = await prisma.resource.update({
      where: { id: Number(id) },
      data: {
        status: "student",
        approved_at: new Date(),
      },
    });

    // Notify uploader
    if (resource.uploader_id) {
      await prisma.notification.create({
        data: {
          user_id: resource.uploader_id,
          title: "Resource Approved",
          message: `Your resource "${resource.title}" has been approved.${
            comment ? " Comment: " + comment : ""
          }`,
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
    const formattedUsers = users.map((user) => {
      const u = user as any;
      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
        status: user.status,
        universityId: u.university_id || u.college_id || "N/A",
        batch: u.batch,
        year: u.year,
        semester: u.semester,
        createdAt: user.created_at,
      };
    });

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
    const results: {
      email: string;
      password: string;
      status: "success" | "failed";
      error?: string;
    }[] = [];

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
          university_id,
        } = student;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          failedCount++;
          errors.push(`${email}: Already registered`);
          results.push({
            email,
            password: "",
            status: "failed",
            error: "Already registered",
          });
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
            university_id:
              university_id ||
              `${email.split("@")[0].toUpperCase()}${Math.floor(
                1000 + Math.random() * 9000
              )}`,
            college_id: null,
          } as any,
        });

        successCount++;
        results.push({ email, password: finalPassword, status: "success" });

        console.log(
          `Student registered: ${email}, Password: ${
            password ? "[PROVIDED]" : finalPassword
          }`
        );
      } catch (err: any) {
        console.error(`Failed to register ${student.email}:`, err);
        failedCount++;
        const errorMessage = err.message || "Registration failed";
        errors.push(`${student.email}: ${errorMessage}`);
        results.push({
          email: student.email,
          password: "",
          status: "failed",
          error: errorMessage,
        });
      }
    }

    res.json({
      message: "Bulk registration completed",
      success: successCount,
      failed: failedCount,
      errors: errors.length > 0 ? errors : undefined,
      results, // Return the credentials
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
