import express from "express";
import { requireAuth } from "../middleware/auth";
import { upload } from "../utils/uploader";
import { requireRole } from "../middleware/roles";
import {
  createBlog,
  listBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRole(["Admin", "SuperAdmin", "Faculty"]),
  upload.single("image"),
  createBlog
);

router.get("/", listBlogs);
router.get("/:id", getBlog);

router.put(
  "/:id",
  requireAuth,
  requireRole(["Admin", "SuperAdmin", "Faculty"]),
  updateBlog
);

router.delete(
  "/:id",
  requireAuth,
  requireRole(["Admin", "SuperAdmin", "Faculty"]),
  deleteBlog
);

export default router;
