// Legacy auth helpers for backward compatibility
// These wrap Better Auth session management with the old API

import { authClient } from "./auth-client";

interface UserWithRole {
  id: string | number;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  role?: { name: string } | string;
  [key: string]: unknown;
}

export type Role =
  | "student"
  | "faculty"
  | "admin"
  | "Admin"
  | "SuperAdmin"
  | "Student"
  | "Faculty";

// Get session synchronously (note: this may return stale data)
// For reactive updates, use useSession() hook instead
export const getUser = (): UserWithRole | null => {
  // Try to get from session storage cache
  const cached = sessionStorage.getItem("better-auth-user");
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      return null;
    }
  }
  return null;
};

export const setUser = (u: unknown) => {
  sessionStorage.setItem("better-auth-user", JSON.stringify(u));
};

export const isAuthenticated = (): boolean => {
  // Check if we have a cached user
  return !!getUser();
};

export const currentRole = (): Role | null => {
  const user = getUser();
  if (!user) return null;

  const role = user.role;
  if (typeof role === "object" && role !== null && "name" in role) {
    return role.name as Role;
  }
  return (role as Role) ?? null;
};

// Legacy token functions (no-ops for Better Auth)
export const getToken = () => "";
export const setToken = () => {
  // No-op: Better Auth uses httpOnly cookies
};
export const clearToken = () => {
  // No-op: Better Auth uses httpOnly cookies
};

// Helper to sync session to sessionStorage for legacy components
export const syncSessionToStorage = async () => {
  try {
    const session = await authClient.getSession();
    if (session?.data?.user) {
      setUser(session.data.user);
    } else {
      sessionStorage.removeItem("better-auth-user");
    }
  } catch {
    sessionStorage.removeItem("better-auth-user");
  }
};
