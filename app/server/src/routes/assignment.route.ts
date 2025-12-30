import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { upload } from "../utils/uploader";
import {
  createAssignment,
  listAssignments,
  getAssignment,
  deleteAssignment,
  downloadAssignmentFile,
  submitAssignment,
  downloadSubmission,
  approveSubmission,
} from "../controllers/assignment.controller";

const router = Router();

router.get("/", requireAuth, listAssignments);
router.get("/:id", requireAuth, getAssignment);
router.get("/:id/download", requireAuth, downloadAssignmentFile);

router.post("/", requireAuth, upload.single("file"), createAssignment);
router.post(
  "/:id/submit",
  requireAuth,
  upload.single("file"),
  submitAssignment
);
router.delete("/:id", requireAuth, deleteAssignment);

router.get("/submissions/:id/download", requireAuth, downloadSubmission);
router.post("/submissions/:id/approve", requireAuth, approveSubmission);

export default router;
