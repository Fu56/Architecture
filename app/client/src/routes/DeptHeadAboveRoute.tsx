import { Outlet, Navigate } from "react-router-dom";
import { useSession } from "../lib/auth-client";

interface UserWithRole {
  id: string | number;
  email: string;
  name?: string;
  role?: { name: string } | string;
}

export default function DeptHeadAboveRoute() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5A270F] mx-auto"></div>
          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#92664A]">
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

  const isAuthorized = role === "SuperAdmin" || role === "DepartmentHead";

  return isAuthorized ? <Outlet /> : <Navigate to="/" replace />;
}
