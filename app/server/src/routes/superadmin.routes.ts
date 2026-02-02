import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/roles";
import {
  getDepartmentHeads,
  createDepartmentHead,
  deleteDepartmentHead,
  updateDepartmentHead,
} from "../controllers/superadmin.controller";

const router = Router();

router.use(requireAuth, requireRole(["SuperAdmin"]));

router.get("/dept-heads", getDepartmentHeads);
router.post("/dept-heads", createDepartmentHead);
router.put("/dept-heads/:id", updateDepartmentHead);
router.delete("/dept-heads/:id", deleteDepartmentHead);

export default router;
