import { Request, Response } from "express";
import { prisma } from "../config/db";
import fs from "fs";
import path from "path";
import { notifyUsers, notifyAll } from "../utils/notifier";
import {
  getApprovalHtml,
  getRejectionHtml,
  getRegistrationHtml,
  getGenericHtml,
  getAccountAuthorizationHtml,
  getArchiveNotificationHtml,
  getRestoreNotificationHtml,
  getSuspendedHtml,
} from "../utils/email";
import {
  getMonthGap,
  parseEthiopianDateString,
  getEthiopianDate,
} from "../utils/ethiopianDate";

export const getPendingResources = async (req: Request, res: Response) => {
  try {
    const resources = await prisma.resource.findMany({
      where: {
        status: {
          in: ["pending", "admin_approved", "admin_rejected"],
        },
      },
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
      batchYear: resource.batch,
      filePath: resource.file_path,
      fileType: resource.file_type,
      fileSize: resource.file_size,
      uploader: {
        id: resource.uploader?.id,
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
    const { comment, is_public } = req.body;

    const requester = (req as any).user;
    const requesterRole = (
      requester?.role?.name ||
      requester?.role ||
      ""
    ).toLowerCase();
    const isDeptHead = ["departmenthead", "superadmin"].includes(requesterRole);

    const reviewerId = requester?.id;
    const reviewerData = reviewerId
      ? await prisma.user.findUnique({
          where: { id: reviewerId },
          select: { first_name: true, last_name: true },
        })
      : null;
    const reviewerName = reviewerData
      ? `${reviewerData.first_name || ""} ${reviewerData.last_name || ""}`.trim()
      : isDeptHead
        ? "Department Head"
        : "Administrator";

    const newStatus = isDeptHead ? "student" : "admin_approved";

    const resource = await prisma.resource.update({
      where: { id: Number(id) },
      data: {
        status: newStatus,
        approved_at: isDeptHead ? new Date() : undefined,
        admin_comment: comment,
        is_public: isDeptHead ? !!is_public : undefined,
      } as any,
      include: {
        uploader: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
      },
    });

    // ── Notify the uploader (in-app + email) ─────────────────────────
    if (resource.uploader_id && resource.uploader) {
      const uploader = resource.uploader as any;
      const uploaderName =
        `${uploader.first_name || ""} ${uploader.last_name || ""}`.trim() ||
        "User";

      const title = isDeptHead
        ? "✅ Resource Approved"
        : "⏳ Resource Pre-approved";
      const message = isDeptHead
        ? `Your resource "${resource.title}" has been reviewed and approved by ${reviewerName}.`
        : `Your resource "${resource.title}" has been pre-approved by Admin ${reviewerName} and is awaiting final Department Head authorization.`;

      await notifyUsers({
        userIds: [resource.uploader_id],
        title,
        message,
        resourceId: resource.id,
        html: getApprovalHtml(
          uploaderName,
          resource.title,
          resource.id,
          comment,
          reviewerName,
        ),
      });

      // Global broadcast — only if final approval
      if (isDeptHead) {
        await notifyAll(
          "New Resource Available",
          `A new architectural resource "${resource.title}" has been verified by ${reviewerName} and is now live in the repository.`,
        );
      }
    }

    res.json({
      message: isDeptHead
        ? "Resource final approved"
        : "Resource pre-approved by admin",
      resource,
    });
  } catch (error) {
    console.error("Approval Error:", error);
    res.status(500).json({ message: "Error approving resource" });
  }
};

export const rejectResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const requester = (req as any).user;
    const requesterRole = (
      requester?.role?.name ||
      requester?.role ||
      ""
    ).toLowerCase();
    const isDeptHead = ["departmenthead", "superadmin"].includes(requesterRole);

    const reviewerId = requester?.id;
    const reviewerData = reviewerId
      ? await prisma.user.findUnique({
          where: { id: reviewerId },
          select: { first_name: true, last_name: true },
        })
      : null;
    const reviewerName = reviewerData
      ? `${reviewerData.first_name || ""} ${reviewerData.last_name || ""}`.trim()
      : isDeptHead
        ? "Department Head"
        : "Administrator";

    const newStatus = isDeptHead ? "rejected" : "admin_rejected";

    const resource = await prisma.resource.update({
      where: { id: Number(id) },
      data: {
        status: newStatus,
        rejected_at: isDeptHead ? new Date() : undefined,
        admin_comment: reason,
      } as any,
      include: {
        uploader: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
      },
    });

    // ── Notify the uploader (in-app + email) ─────────────────────────
    if (resource.uploader_id && resource.uploader) {
      const uploader = resource.uploader as any;
      const uploaderName =
        `${uploader.first_name || ""} ${uploader.last_name || ""}`.trim() ||
        "User";

      const title = isDeptHead
        ? "❌ Resource Rejected"
        : "⚠️ Resource Flagged for Rejection";
      const message = isDeptHead
        ? `Your resource "${resource.title}" was reviewed by ${reviewerName} and has been rejected.`
        : `Your resource "${resource.title}" was reviewed by Admin ${reviewerName} and is recommended for rejection.`;

      await notifyUsers({
        userIds: [resource.uploader_id],
        title,
        message,
        resourceId: resource.id,
        html: getRejectionHtml(
          uploaderName,
          resource.title,
          reason,
          reviewerName,
        ),
      });
    }

    res.json({
      message: isDeptHead
        ? "Resource final rejected"
        : "Resource proposed for rejection by admin",
      resource,
    });
  } catch (error) {
    console.error("Rejection Error:", error);
    res.status(500).json({ message: "Error rejecting resource" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { role: true },
      orderBy: { createdAt: "desc" },
    });

    // Map to camelCase for frontend consistency
    const formattedUsers = users.map((user) => {
      const u = user as any;

      const formatEthDate = (date: Date | null) => {
        if (!date) return "";
        const eth = getEthiopianDate(date);
        return `${eth.year}-${String(eth.month).padStart(2, "0")}-${String(eth.day).padStart(2, "0")}`;
      };

      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: u.role,
        status: user.status,
        universityId: u.university_id || u.college_id || "N/A",
        batch: u.batch,
        year: u.year,
        semester: u.semester,
        specialization: u.specialization,
        department: u.department,
        workerId: u.worker_id,
        academicStartDate: u.academic_start_date,
        academicEndDate: u.academic_end_date,
        academicStartDateEth: formatEthDate(u.academic_start_date),
        academicEndDateEth: formatEthDate(u.academic_end_date),
        createdAt: user.createdAt,
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
      where: { id: id },
      data: { role: { connect: { id: Number(roleId) } } },
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
    const { reason } = req.body; // Optional archive reason
    const resourceId = Number(id);

    // ── Identify reviewer ───────────────────────────────────────────
    const reviewerId = (req as any).user?.id;
    const reviewerData = reviewerId
      ? await prisma.user.findUnique({
          where: { id: reviewerId },
          select: { first_name: true, last_name: true },
        })
      : null;
    const reviewerName = reviewerData
      ? `${reviewerData.first_name || ""} ${reviewerData.last_name || ""}`.trim()
      : "Department Head";

    // 1. Fetch resource to get current file path and uploader
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: {
        uploader: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
      },
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    let newFilePath = resource.file_path;

    // 2. Move file to archive folder if it exists
    if (resource.file_path && fs.existsSync(resource.file_path)) {
      const fileName = path.basename(resource.file_path);
      const originalDir = path.dirname(resource.file_path);
      const archiveDir = path.join(originalDir, "archive");

      if (!fs.existsSync(archiveDir)) {
        fs.mkdirSync(archiveDir, { recursive: true });
      }

      newFilePath = path.join(archiveDir, fileName);

      try {
        fs.renameSync(resource.file_path, newFilePath);
      } catch (moveError) {
        console.error("Failed to move file to archive:", moveError);
        return res
          .status(500)
          .json({ message: "Failed to move file to system archive" });
      }
    }

    // 3. Update database
    const updatedResource = await prisma.resource.update({
      where: { id: resourceId },
      data: {
        status: "archived",
        archived_at: new Date(),
        file_path: newFilePath,
      },
    });

    // 4. Notify uploader (in-app + email)
    if (resource.uploader_id && resource.uploader) {
      const uploader = resource.uploader as any;
      const uploaderName =
        `${uploader.first_name || ""} ${uploader.last_name || ""}`.trim() ||
        "User";

      await notifyUsers({
        userIds: [resource.uploader_id],
        title: "📦 Resource Archived",
        message: `Your resource "${resource.title}" has been moved to the system archive by ${reviewerName}.${
          reason ? ` Reason: ${reason}` : ""
        }`,
        resourceId: resource.id,
        html: getArchiveNotificationHtml(
          uploaderName,
          resource.title,
          reviewerName,
          reason,
        ),
      });
    }

    res.json({
      message: "Resource archived and stored in system archive",
      resource: updatedResource,
    });
  } catch (error) {
    console.error("Archive Error:", error);
    res.status(500).json({ message: "Error archiving resource" });
  }
};

export const restoreResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resourceId = Number(id);

    // ── Identify reviewer ───────────────────────────────────────────
    const reviewerId = (req as any).user?.id;
    const reviewerData = reviewerId
      ? await prisma.user.findUnique({
          where: { id: reviewerId },
          select: { first_name: true, last_name: true },
        })
      : null;
    const reviewerName = reviewerData
      ? `${reviewerData.first_name || ""} ${reviewerData.last_name || ""}`.trim()
      : "Department Head";

    // 1. Fetch resource (with uploader)
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: {
        uploader: {
          select: { id: true, first_name: true, last_name: true, email: true },
        },
      },
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    let newFilePath = resource.file_path;

    // 2. Move file back to main storage if it's in the archive
    if (resource.file_path && resource.file_path.includes("archive")) {
      const fileName = path.basename(resource.file_path);
      const currentDir = path.dirname(resource.file_path);
      const mainStorageDir = path.dirname(currentDir); // 1 level up from "archive"

      newFilePath = path.join(mainStorageDir, fileName);

      try {
        fs.renameSync(resource.file_path, newFilePath);
      } catch (moveError) {
        console.error("Failed to restore file from archive:", moveError);
        return res
          .status(500)
          .json({ message: "Failed to move file back to main storage" });
      }
    }

    // 3. Update database
    const updatedResource = await prisma.resource.update({
      where: { id: resourceId },
      data: {
        status: "student", // Back to live
        archived_at: null,
        file_path: newFilePath,
      },
    });

    // 4. Notify uploader (in-app + email)
    if (resource.uploader_id && resource.uploader) {
      const uploader = resource.uploader as any;
      const uploaderName =
        `${uploader.first_name || ""} ${uploader.last_name || ""}`.trim() ||
        "User";

      await notifyUsers({
        userIds: [resource.uploader_id],
        title: "🔄 Resource Restored",
        message: `Your resource "${resource.title}" has been restored from the archive by ${reviewerName} and is now live again.`,
        resourceId: resource.id,
        html: getRestoreNotificationHtml(
          uploaderName,
          resource.title,
          resource.id,
          reviewerName,
        ),
      });
    }

    res.json({
      message: "Resource restored successfully",
      resource: updatedResource,
    });
  } catch (error) {
    console.error("Restore Error:", error);
    res.status(500).json({ message: "Error restoring resource" });
  }
};

export const toggleResourcePublicStatus = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { is_public } = req.body;
    const resourceId = Number(id);

    const requester = (req as any).user;
    const requesterRole = (
      requester?.role?.name ||
      requester?.role ||
      ""
    ).toLowerCase();
    const isAuthorized = ["departmenthead", "superadmin"].includes(
      requesterRole,
    );

    if (!isAuthorized) {
      return res
        .status(403)
        .json({
          message: "Only Department Heads can toggle public visibility",
        });
    }

    const updatedResource = await prisma.resource.update({
      where: { id: resourceId },
      data: { is_public: Boolean(is_public) },
    });

    res.json({
      message: `Resource visibility set to ${is_public ? "Public" : "Private"}`,
      resource: updatedResource,
    });
  } catch (error) {
    console.error("Toggle Visibility Error:", error);
    res.status(500).json({ message: "Error updating resource visibility" });
  }
};

export const getFlags = async (req: Request, res: Response) => {
  try {
    const flags = await (prisma.flag as any).findMany({
      where: {
        status: {
          in: ["pending", "admin_resolved"],
        },
      },
      include: {
        resource: {
          include: {
            uploader: {
              select: { first_name: true, last_name: true },
            },
          },
        },
        reporter: {
          select: { first_name: true, last_name: true },
        },
      },
    });

    // Map to camelCase for frontend
    const formattedFlags = flags.map((f: any) => ({
      id: f.id,
      resourceId: f.resource_id,
      reason: f.reason,
      status: f.status,
      createdAt: f.created_at,
      resource: {
        id: f.resource.id,
        title: f.resource.title,
        uploader: f.resource.uploader
          ? {
              firstName: f.resource.uploader.first_name,
              lastName: f.resource.uploader.last_name,
            }
          : null,
      },
      reporter: f.reporter
        ? {
            firstName: f.reporter.first_name,
            lastName: f.reporter.last_name,
          }
        : { firstName: "Anonymous", lastName: "" },
    }));

    res.json({ flags: formattedFlags });
  } catch (error) {
    console.error("Get Flags Error:", error);
    res.status(500).json({ message: "Error fetching flags" });
  }
};

export const resolveFlag = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    const { status } = req.body; // e.g. 'resolved', 'ignored'

    const requester = (req as any).user;
    const requesterRole = (
      requester?.role?.name ||
      requester?.role ||
      ""
    ).toLowerCase();
    const isDeptHead = ["departmenthead", "superadmin"].includes(requesterRole);

    const newStatus = isDeptHead ? status || "resolved" : "admin_resolved";

    await prisma.flag.update({
      where: { id: Number(id) },
      data: {
        status: newStatus,
        resolved_at: isDeptHead ? new Date() : undefined,
        resolved_by_id: userId,
      },
    });
    res.json({
      message: isDeptHead
        ? "Flag finalized"
        : "Flag resolved by admin (pending final verification)",
      status: newStatus,
    });
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

    const requester = (req as any).user;
    const requesterRole = (
      requester?.role?.name ||
      requester?.role ||
      ""
    ).toLowerCase();

    // Approval Protocol: Admin-created users require Dept Head authorization
    const initialStatus =
      requesterRole === "admin" ? "pending_approval" : "active";

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
          academic_start_date, // New field support
          academic_end_date, // New field support
        } = student;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          failedCount++;
          errors.push(`${email}: Invalid email format`);
          results.push({
            email,
            password: "",
            status: "failed",
            error: "Invalid email format",
          });
          continue;
        }

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
        const newUser = await prisma.user.create({
          data: {
            name: `${first_name} ${last_name}`,
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role: { connect: { id: studentRole.id } },
            status: initialStatus,
            batch: batch ? Number(batch) : null,
            year: year ? Number(year) : null,
            semester: semester ? Number(semester) : null,
            university_id:
              university_id ||
              `${email.split("@")[0].toUpperCase()}${Math.floor(
                1000 + Math.random() * 9000,
              )}`,
            academic_start_date: academic_start_date
              ? new Date(academic_start_date)
              : null,
            academic_end_date: academic_end_date
              ? new Date(academic_end_date)
              : null,
          } as any,
        });

        // Create Better Auth Account for credentials
        await (prisma as any).account.create({
          data: {
            id: `${newUser.id}_credential`,
            userId: newUser.id,
            accountId: email,
            providerId: "credential",
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        // Notify Student only if already active (not requiring approval)
        if (initialStatus === "active") {
          await notifyUsers({
            userIds: [newUser.id],
            title: "Registration Confirmed",
            message: `Welcome to the Digital Library! You have been registered successfully.`,
            html: getRegistrationHtml(
              `${first_name} ${last_name}`,
              email,
              password || finalPassword,
            ),
          });
        }

        successCount++;
        results.push({ email, password: finalPassword, status: "success" });

        console.log(
          `Student registered: ${email}, Password: ${
            password ? "[PROVIDED]" : finalPassword
          }`,
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
      worker_id,
    } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Protocol Breach: Invalid email syntax detected." });
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

    const requester = (req as any).user;
    const requesterRole = (
      requester?.role?.name ||
      requester?.role ||
      ""
    ).toLowerCase();

    // Approval Protocol: Admin-created users require Dept Head authorization
    const initialStatus =
      requesterRole === "admin" ? "pending_approval" : "active";

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique ID
    const univId = `${first_name.charAt(0)}${last_name.charAt(0)}${Math.floor(
      1000 + Math.random() * 9000,
    )}`.toUpperCase();

    const user = await prisma.user.create({
      data: {
        name: `${first_name} ${last_name}`,
        first_name,
        last_name,
        email,
        password: hashedPassword,
        role: { connect: { id: facultyRole.id } },
        status: initialStatus,
        university_id: univId,
        department: department || null,
        specialization: specialization || null,
        worker_id:
          worker_id ||
          `W${univId.slice(2)}${Math.floor(10 + Math.random() * 89)}`,
      },
      include: {
        role: true,
      },
    });

    // Create Better Auth Account for credentials
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

    // Notify Faculty member only if active
    if (initialStatus === "active") {
      await notifyUsers({
        userIds: [user.id],
        title: "Faculty Registration",
        message: `Welcome to the platform. You have been registered as a Faculty member.`,
        html: getRegistrationHtml(
          `${first_name} ${last_name}`,
          email,
          password,
        ),
      });
    }

    // TODO: Store department and specialization if you have a faculty profile table

    res.status(201).json({
      message: "Faculty member registered successfully",
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role?.name,
        department: user.department,
        specialization: user.specialization,
        worker_id: user.worker_id,
      },
    });
  } catch (error) {
    console.error("Faculty registration error:", error);
    res.status(500).json({ message: "Error registering faculty member" });
  }
};
// Create User (Generic)
export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      roleName,
      roleNames, // New: Array support
      universityId,
      batch,
      year,
      semester,
      specialization,
      department,
      workerId,
      academicStartDate, // Ethiopian string YYYY-MM-DD
      academicEndDate, // Ethiopian string YYYY-MM-DD
    } = req.body;

    // Normalize roles to array
    const rolesToAssign: string[] = roleNames || (roleName ? [roleName] : []);

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      rolesToAssign.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Missing required fields or roles" });
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
      return res
        .status(409)
        .json({ message: "Email already exists in the matrix." });

    if (universityId) {
      const existingUnivId = await prisma.user.findUnique({
        where: { university_id: universityId },
      });
      if (existingUnivId) {
        return res.status(409).json({
          message:
            "The provided University ID is already assigned to another node.",
        });
      }
    }

    // Fetch valid roles
    const validRoles = await prisma.role.findMany({
      where: { name: { in: rolesToAssign } },
    });

    if (validRoles.length !== rolesToAssign.length) {
      return res
        .status(404)
        .json({ message: "One or more requested roles not localized." });
    }

    // Hierarchy Logic Matrix
    const requester = (req as any).user;
    const requesterRole = (
      requester?.role?.name ||
      requester?.role ||
      ""
    ).toLowerCase();

    // Check permissions for ALL roles
    for (const r of rolesToAssign) {
      const rLower = r.toLowerCase();
      if (requesterRole === "departmenthead") {
        const allowedToCreate = [
          "admin",
          "faculty",
          "student",
          "departmenthead",
          "superadmin",
        ];
        if (!allowedToCreate.includes(rLower)) {
          return res.status(403).json({
            message:
              "Security Protocol: Department Heads can only authorize regular or administrative units.",
          });
        }
      }

      if (requesterRole === "admin") {
        const allowedToCreate = ["faculty", "student"];
        if (!allowedToCreate.includes(rLower)) {
          return res.status(403).json({
            message:
              "Security Protocol: Admin units can only authorize Faculty or Student units.",
          });
        }
      }
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique ID if none provided
    const finalUnivId =
      universityId ||
      `${firstName.charAt(0)}${lastName.charAt(0)}${Math.floor(
        1000 + Math.random() * 9000,
      )}`.toUpperCase();

    // Approval Protocol: Admin-created users require Dept Head authorization
    const initialStatus =
      requesterRole === "admin" ? "pending_approval" : "active";

    // Primary Role is the first one selected
    const primaryRole = validRoles.find((r) => r.name === rolesToAssign[0]);
    const secondaryRolesToConnect = validRoles
      .filter((r) => r.name !== rolesToAssign[0])
      .map((r) => ({ id: r.id }));

    if (!primaryRole) throw new Error("Primary Role resolution failed");

    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
        role: { connect: { id: primaryRole.id } }, // Connect Primary
        secondaryRoles: { connect: secondaryRolesToConnect }, // Connect Secondary
        status: initialStatus,
        university_id: finalUnivId,
        batch: batch ? Number(batch) : null,
        year: year ? Number(year) : null,
        semester: semester ? Number(semester) : null,
        specialization: specialization || null,
        department: department || null,
        worker_id: workerId || null,
        academic_start_date: academicStartDate
          ? parseEthiopianDateString(academicStartDate)
          : null,
        academic_end_date: academicEndDate
          ? parseEthiopianDateString(academicEndDate)
          : null,
      } as any,
    });

    // Create Better Auth Account for credentials
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

    // Notify User about account provisioning
    await notifyUsers({
      userIds: [user.id],
      title:
        initialStatus === "active"
          ? "Account Created"
          : "Account Provisioned (Pending Approval)",
      message:
        initialStatus === "active"
          ? "Your account has been created by the administrator."
          : "Your account has been provisioned and is awaiting approval.",
      html: getRegistrationHtml(
        `${firstName} ${lastName}`,
        email,
        password,
        initialStatus,
      ),
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

// Update User
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      roleName,
      roleNames, // Support multi-role update
      status,
      universityId,
      batch,
      year,
      semester,
      specialization,
      department,
      workerId,
      suspendReason,
      academicStartDate,
      academicEndDate,
    } = req.body;

    const requester = (req as any).user;
    const requesterRole = (
      requester?.role?.name ||
      requester?.role ||
      ""
    ).toLowerCase();

    // Fetch Target User
    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    let updateData: any = {
      first_name: firstName,
      last_name: lastName,
      name: firstName && lastName ? `${firstName} ${lastName}` : undefined,
      email,
      status,
      university_id: universityId,
      batch: batch ? Number(batch) : undefined,
      year: year ? Number(year) : undefined,
      semester: semester ? Number(semester) : undefined,
      specialization:
        specialization === "" ? null : specialization || undefined,
      department: department === "" ? null : department || undefined,
      worker_id: workerId === "" ? null : workerId || undefined,
      academic_start_date: academicStartDate
        ? parseEthiopianDateString(academicStartDate)
        : undefined,
      academic_end_date: academicEndDate
        ? parseEthiopianDateString(academicEndDate)
        : undefined,
    };

    // Status Change Authorization Protocol
    if (status && status !== targetUser.status) {
      if (
        requesterRole !== "departmenthead" &&
        requesterRole !== "superadmin"
      ) {
        return res.status(403).json({
          message:
            "Security Protocol: Status transition commands are reserved for Department Head or Super Admin authority.",
        });
      }
    }

    // Role Update Logic
    const rolesToAssign: string[] = roleNames || (roleName ? [roleName] : []);
    if (rolesToAssign.length > 0) {
      // Permission Checks for Roles
      for (const r of rolesToAssign) {
        const rLower = r.toLowerCase();
        if (requesterRole === "departmenthead") {
          if (
            ![
              "admin",
              "faculty",
              "student",
              "departmenthead",
              "superadmin",
            ].includes(rLower)
          ) {
            return res
              .status(403)
              .json({ message: "Forbidden role assignment" });
          }
        }
        if (requesterRole === "admin") {
          if (!["faculty", "student"].includes(rLower)) {
            return res
              .status(403)
              .json({ message: "Forbidden role assignment" });
          }
        }
      }

      const validRoles = await prisma.role.findMany({
        where: { name: { in: rolesToAssign } },
      });

      if (validRoles.length > 0) {
        const primaryRole = validRoles.find((r) => r.name === rolesToAssign[0]);
        const secondaryRoleIds = validRoles
          .filter((r) => r.name !== rolesToAssign[0])
          .map((r) => ({ id: r.id }));

        if (primaryRole) {
          updateData.role = { connect: { id: primaryRole.id } };
          updateData.secondaryRoles = { set: secondaryRoleIds }; // 'set' replaces existing secondary roles
        }
      }
    }

    // Clean undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Notify User about the update
    // SPECIAL PROTOCOL: If status transition from pending_approval to active, send Registration/Welcome email
    if (targetUser.status === "pending_approval" && status === "active") {
      await notifyUsers({
        userIds: [updatedUser.id],
        title: "Account Authorized",
        message: `Your system node has been authorized by the Department Head. You can now access the Nexus.`,
        html: getRegistrationHtml(
          `${updatedUser.first_name} ${updatedUser.last_name}`,
          updatedUser.email,
        ),
      });
    } else if (status === "suspended" && targetUser.status !== "suspended") {
      const execName =
        requester?.name || requester?.first_name || "Department Head";
      await notifyUsers({
        userIds: [updatedUser.id],
        title: "Account Suspended",
        message: `Your system node connectivity has been terminated.`,
        html: getSuspendedHtml(
          `${updatedUser.first_name || "User"}`,
          execName,
          suspendReason,
        ),
      });
    } else {
      await notifyUsers({
        userIds: [updatedUser.id],
        title: "Profile Configuration Update",
        message: `Your system node configuration has been updated by the ${
          requesterRole === "departmenthead"
            ? "Department Head"
            : "Administrator"
        }.`,
        html: getGenericHtml(
          `${updatedUser.first_name} ${updatedUser.last_name}`,
          "Registry Update Protocol",
          `Greetings ${
            updatedUser.first_name || "User"
          },<br/><br/>The architectural registry for your sector has been updated. Your system credentials and profile configurations have been synchronized by the ${
            requesterRole === "departmenthead"
              ? "Department Head"
              : "Administrator"
          }.`,
        ),
      });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// Delete User
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requester = (req as any).user;
    const requesterRole = requester?.role?.name || requester?.role;

    // 1. Fetch target user to check their role
    const targetUser = await prisma.user.findUnique({
      where: { id: id },
      include: { role: true },
    });

    if (!targetUser) {
      return res
        .status(404)
        .json({ message: "Target user not found in matrix." });
    }

    const targetRoleName = (targetUser.role as any)?.name;

    // 2. Hierarchy Protection Logic
    if (
      targetRoleName === "SuperAdmin" &&
      requesterRole !== "SuperAdmin" &&
      requesterRole !== "DepartmentHead"
    ) {
      return res.status(403).json({
        message:
          "Security Protocol Breach: You do not have the authority to decommission a Super Admin node.",
      });
    }

    if (targetRoleName === "DepartmentHead" && requesterRole === "Admin") {
      return res.status(403).json({
        message:
          "Security Protocol Breach: Admin units cannot revoke Department Head authority.",
      });
    }

    if (targetRoleName === "SuperAdmin" && requesterRole === "DepartmentHead") {
      return res.status(403).json({
        message:
          "Security Protocol Breach: Department Head cannot decommission a Super Admin node.",
      });
    }

    await prisma.user.delete({
      where: { id: id },
    });

    res.json({
      message: "Node successfully decommissioned from system matrix.",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Failed to excise user node" });
  }
};

// Approve User Node
export const approveUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const requester = (req as any).user;
    const requesterRole = (
      requester?.role?.name ||
      requester?.role ||
      ""
    ).toLowerCase();
    const isDeptHead = ["departmenthead", "superadmin"].includes(requesterRole);

    const newStatus = isDeptHead ? "active" : "admin_approved_node";

    const user = await prisma.user.update({
      where: { id: id },
      data: { status: newStatus },
    });

    // Notify User about authorization
    if (isDeptHead) {
      await notifyUsers({
        userIds: [user.id],
        title: "Account Authorized",
        message: `Your system node has been authorized by the Department Head. You can now access the Nexus.`,
        html: getAccountAuthorizationHtml(
          `${user.first_name} ${user.last_name}`,
        ),
      });
    } else {
      await notifyUsers({
        userIds: [user.id],
        title: "Account Flagged for Activation",
        message: `Your system node has been pre-verified by an Administrator and is awaiting final Department Head authorization.`,
        html: getGenericHtml(
          `${user.first_name} ${user.last_name}`,
          "Account Pre-verified",
          "Your account has been pre-verified by an administrator and is now in the final authorization queue.",
        ),
      });
    }

    res.json({
      message: isDeptHead
        ? "User node authorized and activated in the matrix."
        : "User node pre-verified by Admin; awaiting final Dept Head authorization.",
      user,
    });
  } catch (error) {
    console.error("Approve User Error:", error);
    res.status(500).json({ message: "Failed to authorize user node" });
  }
};
// News Management
export const createNews = async (req: Request, res: Response) => {
  try {
    const { title, content, isEvent, eventDate } = req.body;
    const authorId = (req as any).user.id;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const news = await (prisma as any).news.create({
      data: {
        title,
        content,
        is_event: !!isEvent,
        event_date: eventDate ? new Date(eventDate) : null,
        author_id: authorId,
      },
    });

    // Notify all entities (Users + Subscribers)
    await notifyAll(
      isEvent ? "Protocol Event: New Schedule" : "System Announcement",
      `A new update "${title}" has been published to the matrix.\n\n${content}`,
    );

    res.status(201).json({
      message: "Intelligence transmission successfully deployed",
      news,
    });
  } catch (error) {
    console.error("Create News Error:", error);
    res
      .status(500)
      .json({ message: "Protocol Breach: Failed to deploy announcement node" });
  }
};

export const deleteNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.news.delete({ where: { id: Number(id) } });
    res.json({ message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete news" });
  }
};

export const sendDirectNotification = async (req: Request, res: Response) => {
  try {
    const { userId, title, message } = req.body;
    if (!userId || !title || !message) {
      return res
        .status(400)
        .json({ message: "UserId, title and message are required" });
    }

    await notifyUsers({
      userIds: [userId],
      title,
      message,
    });

    res.json({ message: "Notification transmitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to transmit notification" });
  }
};

export const broadcastNotification = async (req: Request, res: Response) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) {
      return res
        .status(400)
        .json({ message: "Title and message are required" });
    }

    await notifyAll(title, message);

    res.json({ message: "Global broadcast transmitted successfully" });
  } catch (error) {
    console.error("Broadcast Error:", error);
    res.status(500).json({ message: "Failed to transmit global broadcast" });
  }
};

export const deleteResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resourceId = Number(id);

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Delete file from disk if it exists
    if (resource.file_path && fs.existsSync(resource.file_path)) {
      try {
        fs.unlinkSync(resource.file_path);
      } catch (fileError) {
        console.error("Failed to delete file from disk:", fileError);
      }
    }

    await prisma.resource.delete({
      where: { id: resourceId },
    });

    res.json({ message: "Resource permanently deleted from system matrix." });
  } catch (error) {
    console.error("Permanent Delete Error:", error);
    res.status(500).json({ message: "Error deleting resource permanently" });
  }
};

export const getArchivedResources = async (req: Request, res: Response) => {
  try {
    const resources = await prisma.resource.findMany({
      where: { status: "archived" },
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
      orderBy: { archived_at: "desc" },
    });

    const formattedResources = resources.map((resource) => ({
      id: resource.id,
      title: resource.title,
      author: resource.author,
      keywords: resource.keywords,
      batchYear: resource.batch,
      filePath: resource.file_path,
      fileType: resource.file_type,
      fileSize: resource.file_size,
      uploader: {
        id: resource.uploader?.id,
        firstName: resource.uploader?.first_name,
        lastName: resource.uploader?.last_name,
        email: resource.uploader?.email,
        role: resource.uploader?.role,
      },
      designStage: resource.design_stage,
      status: resource.status,
      downloadCount: resource.download_count,
      isArchived: true,
      uploadedAt: resource.uploaded_at,
      archivedAt: (resource as any).archived_at,
    }));

    res.json(formattedResources);
  } catch (error) {
    console.error("Fetch Archived Error:", error);
    res.status(500).json({ message: "Error fetching archived resources" });
  }
};

export const advanceAcademicStatus = async (req: Request, res: Response) => {
  try {
    const studentRole = await prisma.role.findUnique({
      where: { name: "Student" },
    });

    if (!studentRole) {
      return res.status(500).json({ message: "Student role not found" });
    }

    const students = await prisma.user.findMany({
      where: {
        roleId: studentRole.id,
        status: "active",
      },
    });

    let updatedCount = 0;
    const now = new Date();

    for (const student of students) {
      if (!student.createdAt) continue;

      // Calculate gap in Ethiopian months since registration
      const monthGap = getMonthGap(student.createdAt, now);

      // Logic:
      // 1 year = 13 months in Ethiopian calendar
      // Semester 1 -> 2 happens after a gap of 5 months
      // Year increments every 13 months

      const yearsElapsed = Math.floor(monthGap / 13);
      const remainingMonths = monthGap % 13;
      const semestersElapsedInCurrentYear = Math.floor(remainingMonths / 5);

      // Target state (starting from Year 1, Semester 1)
      const targetYear = 1 + yearsElapsed;
      const targetSemester =
        1 +
        (semestersElapsedInCurrentYear > 1 ? 1 : semestersElapsedInCurrentYear); // Cap at 2 semesters

      // Only advance if the calculated targets are greater than current values
      // Note: We use the existing year/semester as base if they exist
      const currentYear = student.year || 1;
      const currentSemester = student.semester || 1;

      if (
        targetYear > currentYear ||
        (targetYear === currentYear && targetSemester > currentSemester)
      ) {
        await prisma.user.update({
          where: { id: student.id },
          data: {
            year: targetYear,
            semester: targetSemester,
            status: "active", // Maintain active status as requested
          },
        });

        // Notify the student about their promotion
        await notifyUsers({
          userIds: [student.id],
          title: "Academic Promotion Synchronized",
          message: `Your account node has been advanced to Year ${targetYear}, Semester ${targetSemester} based on the Ethiopian academic cycle.`,
          html: getGenericHtml(
            `${student.first_name} ${student.last_name}`,
            "Academic Progression Protocol",
            `Greetings ${student.first_name || "Student"},<br/><br/>The system has synchronized your academic standing. Your current node is now positioned in:<br/><b>Year: ${targetYear}</b><br/><b>Semester: ${targetSemester}</b><br/><br/>Your access levels have been updated accordingly.`,
          ),
        });

        updatedCount++;
      }
    }

    // Log the system action
    const actorId = (req as any).user?.id;
    if (actorId && (prisma as any).systemLog) {
      await (prisma as any).systemLog.create({
        data: {
          action: "BULK_ACADEMIC_PROMOTION",
          entity: "User",
          details: `Advanced ${updatedCount} student nodes based on Ethiopian calendar gap analysis.`,
          actorId: actorId,
        },
      });
    }

    res.json({
      message: `${updatedCount} student nodes successfully advanced in the registry.`,
      updatedCount,
      totalProcessed: students.length,
    });
  } catch (error) {
    console.error("Advance Academic Status Error:", error);
    res
      .status(500)
      .json({
        message: "Protocol Error: Failed to synchronize academic progression.",
      });
  }
};

export const checkAndSuspendExpiredStudents = async (
  req: Request,
  res: Response,
) => {
  try {
    const studentRole = await prisma.role.findUnique({
      where: { name: "Student" },
    });

    if (!studentRole) {
      return res.status(500).json({ message: "Student role not found" });
    }

    const now = new Date();
    // Suspend after 1 month (30 days) from end date
    const suspensionThreshold = new Date();
    suspensionThreshold.setDate(now.getDate() - 30);

    const expiredStudents = await prisma.user.findMany({
      where: {
        roleId: studentRole.id,
        status: "active",
        academic_end_date: {
          lt: suspensionThreshold,
        },
      },
    });

    let suspendedCount = 0;
    for (const student of expiredStudents) {
      await prisma.user.update({
        where: { id: student.id },
        data: {
          status: "suspended",
        },
      });

      await notifyUsers({
        userIds: [student.id],
        title: "⚠️ Account Automatically Suspended",
        message:
          "Your academic term has concluded and the grace period has expired. Your node access has been automatically terminated.",
        html: getSuspendedHtml(
          student.first_name || "User",
          "System Autopilot",
          "Academic term concluded + 1-month grace period expired.",
        ),
      });
      suspendedCount++;
    }

    res.json({
      message: `${suspendedCount} expired student nodes suspended automatically.`,
      suspendedCount,
    });
  } catch (error) {
    console.error("Auto-suspension Error:", error);
    res
      .status(500)
      .json({
        message:
          "Protocol Error: Failed to execute automated suspension sequence.",
      });
  }
};
