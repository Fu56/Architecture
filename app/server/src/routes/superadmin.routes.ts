import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import {
  getDepartmentHeads,
  createDepartmentHead,
  deleteDepartmentHead,
  updateDepartmentHead,
  getSystemLogs,
  getSystemHealth,
  triggerMaintenance,
  getBackups,
  createBackup,
  getExternalNodes,
  reconnectNode,
} from "../controllers/superadmin.controller";

const router = Router();

router.use(requireAuth, requireRole(["SuperAdmin"]));

router.get("/dept-heads", getDepartmentHeads);
router.post("/dept-heads", createDepartmentHead);
router.put("/dept-heads/:id", updateDepartmentHead);
router.delete("/dept-heads/:id", deleteDepartmentHead);
router.get("/logs", getSystemLogs);

// Master Override Handlers
router.get("/health", getSystemHealth);
router.post("/maintenance/diagnose", triggerMaintenance);
router.get("/backups", getBackups);
router.post("/backups", createBackup);
router.get("/external/nodes", getExternalNodes);
router.post("/external/nodes/:id/reconnect", reconnectNode);

export default router;
