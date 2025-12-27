import "dotenv/config";

export const env = {
  port: Number(process.env.PORT || 5000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "dev-secret-key",
  uploadDir: process.env.UPLOAD_DIR || "src/storage",
  baseUrl: process.env.BASE_URL || "http://localhost:5000",
  allowedEmailDomain: process.env.ALLOWED_EMAIL_DOMAIN, // Added for domain validation logic used in controllers
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || "Digital Library <no-reply@example.com>",
  },
};
