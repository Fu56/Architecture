import { Router } from "express";
import {
  getRoles,
  getDesignStages,
  getPublicStats,
} from "../controllers/common.controller";

const router = Router();

router.get("/roles", getRoles);
router.get("/design-stages", getDesignStages);
router.get("/stats", getPublicStats);

export default router;
