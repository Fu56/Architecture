import { Outlet, Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../lib/auth";

export default function ProtectedRoute() {
  const loc = useLocation();
  const isAuth = isAuthenticated();
  const hasUser = !!localStorage.getItem("user");

  if (!isAuth || !hasUser) {
    return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  }

  return <Outlet />;
}
