import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  getMyNotifications,
  markAsRead,
} from "../controllers/notification.controller";

const router = Router();

router.get("/", requireAuth, getMyNotifications);
router.patch("/:id/read", requireAuth, markAsRead);

export default router;
