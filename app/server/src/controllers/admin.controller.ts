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
} from "../utils/email";

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
        admin_comment: comment,
      } as any,
      include: { uploader: true },
    });

    // Notify uploader
    if (resource.uploader_id && resource.uploader) {
      const uploader = resource.uploader as any;
      const title = "Resource Approved";
      const message = `Your resource "${resource.title}" has been approved.${
        comment ? " Comment: " + comment : ""
      }`;

      // Internal & Email Notification
      await notifyUsers({
        userIds: [resource.uploader_id],
        title,
        message,
        resourceId: resource.id,
        html: getApprovalHtml(
          uploader.first_name || "User",
          resource.title,
          resource.id,
          comment,
        ),
      });
    }

    res.json({ message: "Resource approved", resource });
  } catch (error) {
    console.error("Approval Error:", error);
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
        admin_comment: reason,
      } as any,
      include: { uploader: true },
    });

    if (resource.uploader_id && resource.uploader) {
      const uploader = resource.uploader as any;
      const title = "Resource Rejected";
      const message = `Your resource "${resource.title}" was rejected. ${
        reason ? "Reason: " + reason : ""
      }`;

      // Internal & Email Notification
      await notifyUsers({
        userIds: [resource.uploader_id],
        title,
        message,
        resourceId: resource.id,
        html: getRejectionHtml(
          uploader.first_name || "User",
          resource.title,
          reason,
        ),
      });
    }

    res.json({ message: "Resource rejected", resource });
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
    const resourceId = Number(id);

    // 1. Fetch resource to get current file path
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    let newFilePath = resource.file_path;

    // 2. Move file to archive folder if it exists
    if (resource.file_path && fs.existsSync(resource.file_path)) {
      const fileName = path.basename(resource.file_path);
      const archiveDir = path.join(process.cwd(), "storage", "archive");

      // Ensure directory exists
      if (!fs.existsSync(archiveDir)) {
        fs.mkdirSync(archiveDir, { recursive: true });
      }

      newFilePath = path.join(archiveDir, fileName);

      try {
        fs.renameSync(resource.file_path, newFilePath);
      } catch (moveError) {
        console.error("Failed to move file to archive:", moveError);
        // Continue even if file move fails? Maybe not.
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

    // 1. Fetch resource
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    let newFilePath = resource.file_path;

    // 2. Move file back to main storage if it's in the archive
    if (resource.file_path && resource.file_path.includes("archive")) {
      const fileName = path.basename(resource.file_path);
      const mainStorageDir = path.join(process.cwd(), "storage");

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

    res.json({
      message: "Resource restored successfully",
      resource: updatedResource,
    });
  } catch (error) {
    console.error("Restore Error:", error);
    res.status(500).json({ message: "Error restoring resource" });
  }
};

export const getFlags = async (req: Request, res: Response) => {
  try {
    const flags = await (prisma.flag as any).findMany({
      where: { status: "pending" },
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
        const newUser = await prisma.user.create({
          data: {
            name: `${first_name} ${last_name}`,
            first_name,
            last_name,
            email,
            password: hashedPassword,
            role: { connect: { id: studentRole.id } },
            status: "active",
            batch: batch ? Number(batch) : null,
            year: year ? Number(year) : null,
            semester: semester ? Number(semester) : null,
            university_id:
              university_id ||
              `${email.split("@")[0].toUpperCase()}${Math.floor(
                1000 + Math.random() * 9000,
              )}`,
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

        // Notify Student
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
        status: "active",
        university_id: univId,
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

    // Notify Faculty member
    await notifyUsers({
      userIds: [user.id],
      title: "Faculty Registration",
      message: `Welcome to the platform. You have been registered as a Faculty member.`,
      html: getRegistrationHtml(`${first_name} ${last_name}`, email, password),
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
    const requesterRole = requester?.role?.toLowerCase();

    // Check permissions for ALL roles
    for (const r of rolesToAssign) {
      const rLower = r.toLowerCase();
      if (requesterRole === "departmenthead") {
        const allowedToCreate = ["admin", "faculty", "student"];
        if (!allowedToCreate.includes(rLower)) {
          return res.status(403).json({
            message:
              "Security Protocol: Department Heads can only authorize Admin, Faculty, or Student units.",
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

    // Notify User
    await notifyUsers({
      userIds: [user.id],
      title: "Account Created",
      message: `Your account has been created by the administrator.`,
      html: getRegistrationHtml(`${firstName} ${lastName}`, email, password),
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
    };

    // Role Update Logic
    const rolesToAssign: string[] = roleNames || (roleName ? [roleName] : []);
    if (rolesToAssign.length > 0) {
      // Permission Checks for Roles
      for (const r of rolesToAssign) {
        const rLower = r.toLowerCase();
        if (requesterRole === "departmenthead") {
          if (!["admin", "faculty", "student"].includes(rLower)) {
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
    if (targetRoleName === "SuperAdmin" && requesterRole !== "SuperAdmin") {
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
    const requesterRole = requester?.role?.name || requester?.role;

    if (requesterRole !== "DepartmentHead" && requesterRole !== "SuperAdmin") {
      return res.status(403).json({
        message:
          "Security Protocol: Only Department Head or System Developer can authorize pending nodes.",
      });
    }

    const user = await prisma.user.update({
      where: { id: id },
      data: { status: "active" },
    });

    res.json({
      message: "User node authorized and activated in the matrix.",
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

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const news = await prisma.news.create({
      data: {
        title,
        content,
        is_event: !!isEvent,
        event_date: eventDate ? new Date(eventDate) : null,
      },
    });

    // Notify all users about the news/event
    await notifyAll(
      isEvent ? "New Event Scheduled" : "System Announcement",
      title,
    );

    res
      .status(201)
      .json({ message: "News/Event published successfully", news });
  } catch (error) {
    console.error("Create News Error:", error);
    res.status(500).json({ message: "Failed to create news" });
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
