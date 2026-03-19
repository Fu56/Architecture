import { Outlet, Navigate } from "react-router-dom";
import { useSession } from "../lib/auth-client";

interface UserWithRole {
  id: string | number;
  email: string;
  name?: string;
  role?: { name: string } | string;
}

export default function SuperAdminRoute() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-white/50">
            Verifying system developer access...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const user = session.user as UserWithRole & { secondaryRoles?: { name: string }[] };
  const role =
    typeof user.role === "object" && user.role !== null
      ? user.role.name
      : user.role;
  const secondaryRoles = user.secondaryRoles?.map(r => r.name) || [];
  const allRoles = [role, ...secondaryRoles];

  const isSuperAdmin = allRoles.some(r => r === "SuperAdmin");

  return isSuperAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
