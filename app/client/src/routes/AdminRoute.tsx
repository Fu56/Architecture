import { Outlet, Navigate } from "react-router-dom";
import { currentRole, isAuthenticated } from "../lib/auth";

export default function AdminRoute() {
  const role = currentRole();
  const isAdmin = role === "admin" || role === "Admin" || role === "SuperAdmin";
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
