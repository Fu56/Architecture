import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../config/env";

const allowed = [
  "pdf",
  "doc",
  "docx",
  "ppt",
  "pptx",
  "xls",
  "xlsx",
  "jpeg",
  "jpg",
  "png",
  "mp4",
  "rfa",
  "skp",
  "rvt",
  "dwg",
  "zip",
  "rar",
  "7z",
  "txt",
  "md",
];

if (!fs.existsSync(env.uploadDir))
  fs.mkdirSync(env.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).slice(1).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(
        new Error(
          `Unsupported file type: .${ext}. Allowed: ${allowed.join(", ")}`
        )
      );
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 * 1024 }, // 5GB
});
