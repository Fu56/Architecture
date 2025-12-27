import { Outlet, Navigate } from 'react-router-dom';
import { currentRole, isAuthenticated } from '../lib/auth';

export default function AdminRoute() {
    if (!isAuthenticated()) return <Navigate to="/login" replace />;
    return currentRole() === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
}
