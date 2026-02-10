// resource.routes.ts
import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { upload } from "../utils/uploader";
import {
  createResource,
  listResources,
  getResource,
  downloadResource,
  viewResource,
  flagResource,
  addComment,
  rateResource,
  toggleFavorite,
} from "../controllers/resource.controller";

const router = Router();

router.get("/", listResources);
router.get("/:id/download", requireAuth, downloadResource);
router.get("/:id/view", requireAuth, viewResource);
router.get("/:id", getResource);

router.post("/", requireAuth, upload.single("file"), createResource);
router.post("/:id/flag", requireAuth, flagResource);
router.post("/:id/comments", requireAuth, addComment);
router.post("/:id/rate", requireAuth, rateResource);
router.post("/:id/favorite", requireAuth, toggleFavorite);

export default router;
