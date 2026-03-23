import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { upload } from "../utils/uploader";
import {
  createAssignment,
  listAssignments,
  getAssignment,
  deleteAssignment,
  downloadAssignmentFile,
  viewAssignmentBrief,
  submitAssignment,
  downloadSubmission,
  viewSubmission,
  requestResourceUpload,
  permitResourceUpload,
  denyResourceUpload,
  addFeedback,
  updateAssignmentDeadline,
} from "../controllers/assignment.controller";

const router = Router();

router.get("/", requireAuth, listAssignments);
router.get("/:id", requireAuth, getAssignment);
router.get("/:id/download", requireAuth, downloadAssignmentFile);
router.get("/:id/view", requireAuth, viewAssignmentBrief);
router.patch("/:id/deadline", requireAuth, updateAssignmentDeadline);

router.post("/", requireAuth, upload.single("file"), createAssignment);
router.post(
  "/:id/submit",
  requireAuth,
  upload.single("file"),
  submitAssignment
);
router.delete("/:id", requireAuth, deleteAssignment);

router.get("/submissions/:id/download", requireAuth, downloadSubmission);
router.get("/submissions/:id/view", requireAuth, viewSubmission);
router.post("/submissions/:id/request-upload", requireAuth, requestResourceUpload);
router.post("/submissions/:id/permit-upload", requireAuth, permitResourceUpload);
router.post("/submissions/:id/deny-upload", requireAuth, denyResourceUpload);
router.post("/submissions/:id/feedback", requireAuth, addFeedback);

export default router;
