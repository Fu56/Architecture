// admin.routes.ts
import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import {
  getPendingResources,
  approveResource,
  rejectResource,
  archiveResource,
  restoreResource,
  getAllUsers,
  manageUserRole,
  getStats,
  getFlags,
  resolveFlag,
  bulkRegisterStudents,
  registerFaculty,
  createUser,
  updateUser,
  deleteUser,
  approveUser,
  createNews,
  deleteNews,
  sendDirectNotification,
  broadcastNotification,
  deleteResource,
  getArchivedResources,
  advanceAcademicStatus,
  checkAndSuspendExpiredStudents,
} from "../controllers/admin.controller";

const router = Router();

router.use(requireAuth, requireRole(["Admin", "SuperAdmin", "DepartmentHead"])); // Adjust role names as needed

// Resource Approval — Admin can propose, Dept Head can finalize
router.get(
  "/resources/pending",
  requireRole(["Admin", "DepartmentHead", "SuperAdmin"]),
  getPendingResources,
);
router.patch(
  "/resources/:id/approve",
  requireRole(["Admin", "DepartmentHead", "SuperAdmin"]),
  approveResource,
);
router.patch(
  "/resources/:id/reject",
  requireRole(["Admin", "DepartmentHead", "SuperAdmin"]),
  rejectResource,
);
router.patch(
  "/resources/:id/archive",
  requireRole(["Admin", "DepartmentHead", "SuperAdmin"]),
  archiveResource,
);
router.patch(
  "/resources/:id/restore",
  requireRole(["Admin", "DepartmentHead", "SuperAdmin"]),
  restoreResource,
);
router.delete(
  "/resources/:id/permanent",
  requireRole(["DepartmentHead", "SuperAdmin"]), // Permanent deletion remains restricted
  deleteResource,
);
router.get(
  "/resources/archived",
  requireRole(["Admin", "DepartmentHead", "SuperAdmin"]),
  getArchivedResources,
);

router.get("/flags", requireRole(["Admin", "DepartmentHead", "SuperAdmin"]), getFlags);
router.patch(
  "/flags/:id/resolve",
  requireRole(["Admin", "DepartmentHead", "SuperAdmin"]),
  resolveFlag,
);

router.get("/users", getAllUsers);
router.post("/users/create", createUser);
router.patch("/users/:id", updateUser); // Generic update
router.delete("/users/:id", deleteUser);
// User Registration Approval — restricted to DepartmentHead and SuperAdmin only
router.patch(
  "/users/:id/approve",
  requireRole(["DepartmentHead"]),
  approveUser,
);
router.patch("/users/:id/role", manageUserRole); // Keep specific if needed, or deprecate
router.post("/users/bulk-register", bulkRegisterStudents);
router.post("/users/register-faculty", registerFaculty);
router.post(
  "/users/advance-academic",
  requireRole(["DepartmentHead", "SuperAdmin"]),
  advanceAcademicStatus,
);
router.post(
  "/users/check-suspension",
  requireRole(["DepartmentHead", "SuperAdmin"]),
  checkAndSuspendExpiredStudents,
);

router.get("/stats", getStats);

// News management
router.post("/news", requireRole(["DepartmentHead", "SuperAdmin"]), createNews);
router.delete(
  "/news/:id",
  requireRole(["DepartmentHead", "SuperAdmin"]),
  deleteNews,
);
router.post("/notifications/send", sendDirectNotification);
// Global Broadcast — restricted to DepartmentHead and SuperAdmin only
router.post(
  "/notifications/broadcast",
  requireRole(["DepartmentHead", "SuperAdmin"]),
  broadcastNotification,
);

export default router;
