import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../config/db";
import { env } from "../config/env";
import bcrypt from "bcryptjs";
import { customSession } from "better-auth/plugins";
import { sendNotificationEmail, getPasswordResetHtml } from "../utils/email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    customSession(async ({ user, session }) => {
      const roleId = (user as any).roleId;

      // Fetch full user details including secondary roles
      // Note: 'user' here might be the session user object, so safe to query by ID
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: { role: true, secondaryRoles: true },
      });

      return {
        user: {
          ...user,
          role: dbUser?.role ? { name: dbUser.role.name } : undefined,
          secondaryRoles: dbUser?.secondaryRoles || [], // Expose secondary roles
        },
        session,
      };
      return { user, session };
    }),
  ],

  // advanced: { ... }, // Removed custom ID config as we switched to String IDs
  baseURL: (env.baseUrl || "http://localhost:5000") + "/api/auth",
  secret: env.jwtSecret, // Using existing JWT secret for Better Auth
  trustedOrigins: ["http://localhost:5173", "http://localhost:3000"],
  emailAndPassword: {
    enabled: true,
    password: {
      hash: async (value) => {
        return await bcrypt.hash(value, 10);
      },
      verify: async ({ hash, password }) => {
        return await bcrypt.compare(password, hash);
      },
    },
    async sendResetPassword({ url, user }) {
      await sendNotificationEmail(
        user.email,
        "Reset Your Password",
        `Click here to reset your password: ${url}`,
        getPasswordResetHtml(url),
      );
    },
  },
  user: {
    additionalFields: {
      first_name: {
        type: "string",
        required: false,
      },
      last_name: {
        type: "string",
        required: false,
      },
      roleId: {
        type: "number",
        required: false,
      },
      batch: {
        type: "number",
        required: false,
      },
      year: {
        type: "number",
        required: false,
      },
      semester: {
        type: "number",
        required: false,
      },
      status: {
        type: "string",
        required: false,
      },
      university_id: {
        type: "string",
        required: false,
      },
    },
  },
});
