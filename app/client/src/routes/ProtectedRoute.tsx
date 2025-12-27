import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';

export default function ProtectedRoute() {
    const loc = useLocation();
    return isAuthenticated() ? <Outlet /> : <Navigate to="/login" state={{ from: loc }} replace />;
}
