import { Router } from "express";
import {
  getPendingResources,
  approveResource,
  rejectResource,
  updateResourceStatus,
  getFlags,
  resolveFlag,
  createNews,
  deleteNews,
  advanceAcademicStatus,
  checkAndSuspendExpiredStudents,
  broadcastNotification,
  updateUser,
  getAllUsers,
  registerFaculty,
  bulkRegisterStudents,
  deleteUser,
  createUser,
  toggleRepresentation,
  updateUserPermissions,
  archiveResource,
  restoreResource,
  getArchivedResources,
} from "../controllers/admin.controller";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/roles";

const router = Router();

// Protect all admin routes
router.use(requireAuth, requireRole(["Admin", "DepartmentHead", "SuperAdmin"]));

// Resource Management
router.get("/resources/pending", getPendingResources);
router.patch("/resources/:id/approve", approveResource);
router.patch("/resources/:id/reject", rejectResource);
router.patch("/resources/:id/status", updateResourceStatus);
router.patch("/resources/:id/archive", archiveResource);
router.patch("/resources/:id/restore", restoreResource);
router.get("/resources/archived", getArchivedResources);
router.post("/resources/advance", advanceAcademicStatus);
router.post("/resources/check-expired", checkAndSuspendExpiredStudents);

// Flag Management
router.get("/flags", getFlags);
router.patch("/flags/:id/resolve", resolveFlag);

// News & Broadcasts
router.post("/news", createNews);
router.delete("/news/:id", deleteNews);
router.post("/broadcast", broadcastNotification);

// User Management
router.get("/users", getAllUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.post("/users/register-faculty", registerFaculty);
router.post("/users/bulk-register", bulkRegisterStudents);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/represent", toggleRepresentation);
router.patch("/users/:id/permissions", updateUserPermissions);

export default router;
