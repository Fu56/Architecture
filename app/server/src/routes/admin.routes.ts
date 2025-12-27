// admin.routes.ts
import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import {
  getPendingResources,
  approveResource,
  rejectResource,
  archiveResource,
  getAllUsers,
  manageUserRole,
  getStats,
  getFlags,
  resolveFlag,
} from "../controllers/admin.controller";

const router = Router();

router.use(requireAuth, requireRole(["Admin", "SuperAdmin"])); // Adjust role names as needed

router.get("/resources/pending", getPendingResources);
router.patch("/resources/:id/approve", approveResource);
router.patch("/resources/:id/reject", rejectResource);
router.patch("/resources/:id/archive", archiveResource);

router.get("/flags", getFlags);
router.patch("/flags/:id/resolve", resolveFlag);

router.get("/users", getAllUsers);
router.patch("/users/:id/role", manageUserRole);

router.get("/stats", getStats);

export default router;
