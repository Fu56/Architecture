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
  createNews,
  deleteNews,
  sendDirectNotification,
  broadcastNotification,
} from "../controllers/admin.controller";

const router = Router();

router.use(requireAuth, requireRole(["Admin", "SuperAdmin"])); // Adjust role names as needed

router.get("/resources/pending", getPendingResources);
router.patch("/resources/:id/approve", approveResource);
router.patch("/resources/:id/reject", rejectResource);
router.patch("/resources/:id/archive", archiveResource);
router.patch("/resources/:id/restore", restoreResource);

router.get("/flags", getFlags);
router.patch("/flags/:id/resolve", resolveFlag);

router.get("/users", getAllUsers);
router.post("/users/create", createUser);
router.patch("/users/:id", updateUser); // Generic update
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/role", manageUserRole); // Keep specific if needed, or deprecate
router.post("/users/bulk-register", bulkRegisterStudents);
router.post("/users/register-faculty", registerFaculty);

router.get("/stats", getStats);

// News management
router.post("/news", createNews);
router.delete("/news/:id", deleteNews);
router.post("/notifications/send", sendDirectNotification);
router.post("/notifications/broadcast", broadcastNotification);

export default router;
