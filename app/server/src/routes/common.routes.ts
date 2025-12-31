import { Router } from "express";
import {
  getRoles,
  getDesignStages,
  getPublicStats,
  getAllNews,
} from "../controllers/common.controller";

const router = Router();

router.get("/roles", getRoles);
router.get("/design-stages", getDesignStages);
router.get("/stats", getPublicStats);
router.get("/news", getAllNews);

export default router;
