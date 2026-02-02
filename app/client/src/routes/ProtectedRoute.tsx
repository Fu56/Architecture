import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSession } from "../lib/auth-client";

export default function ProtectedRoute() {
  const loc = useLocation();
  const { data: session, isPending } = useSession();

  if (isPending) {
    // Show loading state while checking session
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  }

  return <Outlet />;
}
