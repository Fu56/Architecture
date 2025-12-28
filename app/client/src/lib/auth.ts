import { jwtDecode } from "jwt-decode";

export type Role =
  | "student"
  | "faculty"
  | "admin"
  | "Admin"
  | "SuperAdmin"
  | "Student"
  | "Faculty";

export const getToken = () => localStorage.getItem("token");
export const setToken = (t: string) => localStorage.setItem("token", t);
export const clearToken = () => localStorage.removeItem("token");

export const getUser = () => {
  const u = localStorage.getItem("user");
  return u ? JSON.parse(u) : null;
};
export const setUser = (u: unknown) =>
  localStorage.setItem("user", JSON.stringify(u));

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded: { exp: number } = jwtDecode(token);
    // Check if token is expired
    if (Date.now() >= decoded.exp * 1000) {
      clearToken();
      localStorage.removeItem("user");
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const currentRole = (): Role | null => {
  if (!isAuthenticated()) return null;
  const user = getUser();
  const role = user?.role;
  if (typeof role === "object" && role !== null && "name" in role) {
    return role.name as Role;
  }
  return (role as Role) ?? null;
};
