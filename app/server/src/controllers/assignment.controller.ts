import { Request, Response } from "express"; // Trigger reload
import { prisma } from "../config/db";
import path from "path";

import { notifyUsers } from "../utils/notifier";

const getUserId = (req: Request): string | undefined => (req as any).user?.id;

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const file = (req as any).file;
    const {
      title,
      description,
      due_date,
      design_stage_id,
      custom_design_stage,
      academic_year,
      semester,
      allow_progress_updates,
    } = req.body;
    const userId = getUserId(req);

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const assignment = await (prisma as any).assignment.create({
      data: {
        title,
        description,
        due_date: due_date ? new Date(due_date) : null,
        academic_year: academic_year ? Number(academic_year) : null,
        semester: semester ? Number(semester) : null,
        allow_progress_updates: allow_progress_updates === "true" || allow_progress_updates === true,
        file_path: file?.path,
        file_type: file?.mimetype,
        file_size: file?.size,
        creator_id: userId,
        design_stage_id: design_stage_id && design_stage_id !== "other" ? Number(design_stage_id) : null,
        custom_design_stage: custom_design_stage || (design_stage_id === "other" ? "Custom Course" : null),
      },
    });

    // Notify matching students
    const targetStudents = await prisma.user.findMany({
      where: {
        role: { name: "Student" },
        AND: [
          academic_year ? { year: Number(academic_year) } : {},
          semester ? { semester: Number(semester) } : {},
        ],
      },
      select: { id: true, email: true, first_name: true },
    });

    if (targetStudents.length > 0) {
      const title = "New Assignment Posted";
      const message = `A new assignment "${assignment.title}" has been published for your academic cycle.`;

      // Internal & Email Notification
      await notifyUsers({
        userIds: targetStudents.map((s) => s.id),
        title,
        message,
        assignmentId: assignment.id,
      });
    }

    res.status(201).json(assignment);
  } catch (error) {
    console.error("Create Assignment Error:", error);
    res.status(500).json({ message: "Failed to create assignment" });
  }
};

export const listAssignments = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    let whereClause = {};
    if (user?.role?.name === "Student") {
      whereClause = {
        AND: [
          {
            OR: [{ academic_year: user.year }, { academic_year: null }],
          },
          {
            OR: [{ semester: user.semester }, { semester: null }],
          },
        ],
      };
    }

    const assignments = await (prisma as any).assignment.findMany({
      where: whereClause,
      include: {
        creator: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        design_stage: true,
      },
      orderBy: { created_at: "desc" },
    });
    res.status(200).json(assignments);
  } catch (error) {
    console.error("List Assignments Error:", error);
    res.status(500).json({ message: "Failed to fetch assignments" });
  }
};

export const getAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    const isStudent = user?.role?.name === "Student";

    const assignment = await (prisma as any).assignment.findUnique({
      where: { id: Number(id) },
      include: {
        creator: {
          select: { id: true, first_name: true, last_name: true },
        },
        design_stage: true,
        submissions: {
          where: isStudent ? { student_id: userId } : undefined,
          include: {
            student: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                year: true,
                batch: true,
              },
            },
          },
          orderBy: { submitted_at: "desc" },
        },
      },
    });
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    // Check if deadline has passed
    const isPastDeadline = assignment.due_date
      ? new Date(assignment.due_date) < new Date()
      : false;

    res.status(200).json({ ...assignment, isPastDeadline });
  } catch (error) {
    console.error("Get Assignment Error:", error);
    res.status(500).json({ message: "Failed to fetch assignment details" });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    const assignment = await (prisma as any).assignment.findUnique({
      where: { id: Number(id) },
    });
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    // Only creator or admin can delete
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });
    if (
      assignment.creator_id !== userId &&
      user?.role?.name !== "Admin" &&
      user?.role?.name !== "SuperAdmin"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await (prisma as any).assignment.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: "Assignment deleted" });
  } catch (error) {
    console.error("Delete Assignment Error:", error);
    res.status(500).json({ message: "Failed to delete assignment" });
  }
};

export const downloadAssignmentFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assignment = await (prisma as any).assignment.findUnique({
      where: { id: Number(id) },
    });

    if (!assignment || !assignment.file_path) {
      return res.status(404).json({ message: "File not found" });
    }

    const absPath = path.resolve(assignment.file_path);
    res.download(absPath);
  } catch (error) {
    res.status(500).json({ message: "Error downloading file" });
  }
};

export const submitAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = (req as any).file;
    const userId = getUserId(req);
    const { submission_type } = req.body;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!file) return res.status(400).json({ message: "File is required" });

    // Check if assignment exists and get deadline
    const assignment = await (prisma as any).assignment.findUnique({
      where: { id: Number(id) },
    });

    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    // Check if deadline has passed
    if (assignment.due_date && new Date(assignment.due_date) < new Date()) {
      return res.status(400).json({
        message: "Deadline has passed. Submissions are no longer accepted.",
      });
    }

    // Create submission
    const submission = await (prisma as any).submission.create({
      data: {
        student_id: userId,
        assignment_id: Number(id),
        file_path: file.path,
        file_type: file.mimetype,
        file_size: file.size,
        submission_type: submission_type || "final",
      },
    });

    res.status(201).json(submission);
  } catch (error) {
    console.error("Submit Assignment Error:", error);
    res.status(500).json({ message: "Failed to submit assignment" });
  }
};

export const downloadSubmission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const submission = await (prisma as any).submission.findUnique({
      where: { id: Number(id) },
    });

    if (!submission || !submission.file_path) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const absPath = path.resolve(submission.file_path);
    res.download(absPath);
  } catch (error) {
    res.status(500).json({ message: "Error downloading submission" });
  }
};

export const viewSubmission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const submission = await (prisma as any).submission.findUnique({
      where: { id: Number(id) },
    });

    if (!submission || !submission.file_path) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const absPath = path.resolve(submission.file_path);
    // Setting content type helps browser view inline
    res.sendFile(absPath);
  } catch (error) {
    res.status(500).json({ message: "Error viewing submission" });
  }
};

export const viewAssignmentBrief = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assignment = await (prisma as any).assignment.findUnique({
      where: { id: Number(id) },
    });

    if (!assignment || !assignment.file_path) {
      return res.status(404).json({ message: "Assignment file not found" });
    }

    const absPath = path.resolve(assignment.file_path);
    res.sendFile(absPath);
  } catch (error) {
    res.status(500).json({ message: "Error viewing assignment brief" });
  }
};


export const requestResourceUpload = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Submission ID
    const userId = getUserId(req);

    // Verify User Role (Admin/Faculty only)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (
      user?.role?.name !== "Admin" &&
      user?.role?.name !== "Faculty" &&
      user?.role?.name !== "SuperAdmin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await (prisma as any).submission.update({
      where: { id: Number(id) },
      data: { resource_upload_status: "requested" },
      include: { assignment: true, student: true },
    });

    // Notify student targeting the specific type and name
    const studentName = `${updated.student?.first_name || "Student"}`;
    await notifyUsers({
      userIds: [updated.student_id],
      title: "Resource Upload Request",
      message: `Dear ${studentName}, your instructor requested to publish your work for "${updated.assignment.title}" as a public resource. Please provide your permission to proceed.`,
      assignmentId: updated.assignment_id,
    });

    res.status(200).json({ message: "Upload request sent to student", submission: updated });
  } catch (error) {
    console.error("Request Upload Error:", error);
    res.status(500).json({ message: "Failed to request upload" });
  }
};

export const permitResourceUpload = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Submission ID
    const userId = getUserId(req);

    const submission = await (prisma as any).submission.findUnique({
      where: { id: Number(id) },
      include: {
        assignment: { include: { design_stage: true } },
        student: true,
      },
    });

    if (!submission) return res.status(404).json({ message: "Submission not found" });
    if (submission.student_id !== userId) {
      return res.status(403).json({ message: "Only the student worker can permit the upload of their work." });
    }

    // Create Resource
    const resource = await (prisma as any).resource.create({
      data: {
        title: submission.assignment.title,
        author: `${submission.student.first_name} ${submission.student.last_name}`,
        keywords: ["Assignment Output", "Approved Output"],
        forYearStudents: submission.student.year || 0,
        batch: submission.student.batch,
        file_path: submission.file_path,
        file_type: submission.file_type,
        file_size: submission.file_size,
        uploader_id: submission.student_id,
        design_stage_id: submission.assignment.design_stage_id,
        status: "approved",
        approved_at: new Date(),
        priority_tag: "Student Showcase",
        is_public: true,
      },
    });

    // Update submission status
    await (prisma as any).submission.update({
      where: { id: Number(id) },
      data: { resource_upload_status: "permitted", status: "featured" },
    });

    // Notify student
    await notifyUsers({
      userIds: [submission.student_id],
      title: "Resource Published",
      message: `Your work for "${submission.assignment.title}" has been successfully published to the Resource Library.`,
      resourceId: resource.id,
    });

    res.status(200).json({
      message: "Permission granted and work published",
      resource,
    });
  } catch (error) {
    console.error("Permit Upload Error:", error);
    res.status(500).json({ message: "Failed to process permission" });
  }
};

export const denyResourceUpload = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const submission = await (prisma as any).submission.findUnique({ where: { id: Number(id) } });

    if (!submission || submission.student_id !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await (prisma as any).submission.update({
      where: { id: Number(id) },
      data: { resource_upload_status: "denied" },
    });

    res.status(200).json({ message: "Upload request denied" });
  } catch (error) {
    res.status(500).json({ message: "Error denying request" });
  }
};


export const addFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Submission ID
    const { feedback } = req.body;
    const userId = getUserId(req);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (
      user?.role?.name !== "Admin" &&
      user?.role?.name !== "Faculty" &&
      user?.role?.name !== "SuperAdmin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const submission = await (prisma as any).submission.update({
      where: { id: Number(id) },
      data: { feedback },
      include: { assignment: true, student: true },
    });

    const studentName = `${submission.student?.first_name || "Student"}`;
    const subType = submission.submission_type === "progress" ? "progress update" : "final submission";

    // Notify student targeting the specific type and name
    await notifyUsers({
      userIds: [submission.student_id],
      title: "New Feedback Received",
      message: `Dear ${studentName}, your instructor left a comment on your ${subType} for "${submission.assignment.title}".`,
      assignmentId: submission.assignment_id,
    });

    res.status(200).json({ message: "Feedback added", submission });
  } catch (error) {
    console.error("Add Feedback Error:", error);
    res.status(500).json({ message: "Failed to add feedback" });
  }
};

export const updateAssignmentDeadline = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { due_date } = req.body;
    const userId = getUserId(req);

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const assignment = await (prisma as any).assignment.findUnique({
      where: { id: Number(id) },
    });
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    const roleName = user?.role?.name;
    if (
      assignment.creator_id !== userId &&
      roleName !== "Admin" &&
      roleName !== "SuperAdmin" &&
      roleName !== "Faculty" &&
      roleName !== "DepartmentHead"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await (prisma as any).assignment.update({
      where: { id: Number(id) },
      data: { due_date: due_date ? new Date(due_date) : null },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update Assignment Deadline Error:", error);
    res.status(500).json({ message: "Failed to update deadline" });
  }
};

