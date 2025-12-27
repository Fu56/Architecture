import { Router } from "express";
import { getRoles, getDesignStages } from "../controllers/common.controller";

const router = Router();

router.get("/roles", getRoles);
router.get("/design-stages", getDesignStages);

export default router;
