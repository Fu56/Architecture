import { Request, Response } from "express";
import { prisma } from "../config/db";
import path from "path";

const getUserId = (req: Request): string | undefined => (req as any).user?.id;

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const file = (req as any).file;
    const { title, description, due_date, design_stage_id } = req.body;
    const userId = getUserId(req);

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const assignment = await (prisma as any).assignment.create({
      data: {
        title,
        description,
        due_date: due_date ? new Date(due_date) : null,
        academic_year: req.body.academic_year
          ? Number(req.body.academic_year)
          : null,
        semester: req.body.semester ? Number(req.body.semester) : null,
        file_path: file?.path,
        file_type: file?.mimetype,
        file_size: file?.size,
        creator_id: userId,
        design_stage_id: design_stage_id ? Number(design_stage_id) : null,
      },
    });

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

export const approveSubmission = async (req: Request, res: Response) => {
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

    const submission = await (prisma as any).submission.findUnique({
      where: { id: Number(id) },
      include: {
        assignment: { include: { design_stage: true } },
        student: true,
      },
    });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Create Resource
    const resource = await (prisma as any).resource.create({
      data: {
        title: submission.assignment.title,
        author: `${submission.student.first_name} ${submission.student.last_name}`,
        keywords: [],
        // Use user's year/batch or assignment's? User usually.
        forYearStudents: submission.student.year || 0,
        batch: submission.student.batch,
        file_path: submission.file_path,
        file_type: submission.file_type,
        file_size: submission.file_size,
        uploader_id: submission.student_id,
        design_stage_id: submission.assignment.design_stage_id,
        status: "approved",
        approved_at: new Date(),
        priority_tag: "Assignment Output",
      },
    });

    // Update submission status
    await (prisma as any).submission.update({
      where: { id: Number(id) },
      data: { status: "approved" },
    });

    res.status(200).json({
      message: "Submission approved and added to resources",
      resource,
    });
  } catch (error) {
    console.error("Approve Submission Error:", error);
    res.status(500).json({ message: "Failed to approve submission" });
  }
};
