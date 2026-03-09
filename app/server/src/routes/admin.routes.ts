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
} from "../controllers/admin.controller";

const router = Router();

router.use(requireAuth, requireRole(["Admin", "SuperAdmin", "DepartmentHead"])); // Adjust role names as needed

// Resource Approval — restricted to DepartmentHead and SuperAdmin only
router.get(
  "/resources/pending",
  requireRole(["DepartmentHead", "SuperAdmin"]),
  getPendingResources,
);
router.patch(
  "/resources/:id/approve",
  requireRole(["DepartmentHead", "SuperAdmin"]),
  approveResource,
);
router.patch(
  "/resources/:id/reject",
  requireRole(["DepartmentHead", "SuperAdmin"]),
  rejectResource,
);
router.patch(
  "/resources/:id/archive",
  requireRole(["DepartmentHead", "SuperAdmin"]),
  archiveResource,
);
router.patch(
  "/resources/:id/restore",
  requireRole(["DepartmentHead", "SuperAdmin"]),
  restoreResource,
);
router.delete(
  "/resources/:id/permanent",
  requireRole(["DepartmentHead", "SuperAdmin"]),
  deleteResource,
);
router.get(
  "/resources/archived",
  requireRole(["DepartmentHead", "SuperAdmin"]),
  getArchivedResources,
);

router.get("/flags", getFlags);
router.patch(
  "/flags/:id/resolve",
  requireRole(["DepartmentHead", "SuperAdmin"]),
  resolveFlag,
);

router.get("/users", getAllUsers);
router.post("/users/create", createUser);
router.patch("/users/:id", updateUser); // Generic update
router.delete("/users/:id", deleteUser);
// User Registration Approval — restricted to DepartmentHead and SuperAdmin only
router.patch(
  "/users/:id/approve",
  requireRole(["DepartmentHead", "SuperAdmin"]),
  approveUser,
);
router.patch("/users/:id/role", manageUserRole); // Keep specific if needed, or deprecate
router.post("/users/bulk-register", bulkRegisterStudents);
router.post("/users/register-faculty", registerFaculty);

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
