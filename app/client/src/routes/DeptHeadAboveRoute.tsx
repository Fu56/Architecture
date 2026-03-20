import { Outlet, Navigate } from "react-router-dom";
import { useSession } from "../lib/auth-client";

interface UserWithRole {
  id: string | number;
  email: string;
  name?: string;
  role?: { name: string } | string;
  secondaryRoles?: { name: string }[];
  permissions?: {
    canApproveResources?: boolean;
    canResolveFlags?: boolean;
    canEditUsers?: boolean;
    canDeleteNodes?: boolean;
  };
}

export default function DeptHeadAboveRoute() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5A270F] mx-auto"></div>
          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#92664A] dark:text-[#EEB38C]/40">
            Verifying authorization level...
          </p>
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
  const secondaryRoles = user.secondaryRoles?.map(r => r.name) || [];
  const allRoles = [role, ...secondaryRoles];

  // Standard DeptHead / SuperAdmin check
  const isDeptHeadAbove = allRoles.some(r => r === "SuperAdmin" || r === "DepartmentHead");

  // Delegated permission check — users granted resource approval authority
  const perms = user.permissions || {};
  const hasDelegatedApproval =
    perms.canApproveResources === true ||
    perms.canDeleteNodes === true;     // full authority also grants this

  return isDeptHeadAbove || hasDelegatedApproval ? <Outlet /> : <Navigate to="/" replace />;
}
