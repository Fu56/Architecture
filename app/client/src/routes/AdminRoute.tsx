import { Outlet, Navigate } from "react-router-dom";
import { useSession } from "../lib/auth-client";

interface UserWithRole {
  id: string | number;
  email: string;
  name?: string;
  role?: { name: string } | string;
}

export default function AdminRoute() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    // Show loading state while checking session
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const user = session.user as UserWithRole;
  const role =
    typeof user.role === "object" && user.role !== null
      ? user.role.name
      : user.role;
  const isAdmin = role === "admin" || role === "Admin" || role === "SuperAdmin";

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
