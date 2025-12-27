import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/ui/Layout';
import Home from './pages/Home';
import Browse from './pages/library/Browse';
import ResourceDetails from './pages/library/ResourceDetails';
import Upload from './pages/library/Upload';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserDashboard from './pages/user/Dashboard';
import MyUploads from './pages/user/MyUploads';
import Notifications from './pages/user/Notifications';
import Profile from './pages/user/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import Analytics from './pages/admin/Analytics';
import ManageUsers from './pages/admin/ManageUsers';
import Approvals from './pages/admin/Approvals';
import Flags from './pages/admin/Flags';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Placeholder pages for static content
const About = () => <div className="container mx-auto py-8">About Us Page</div>;
const Blog = () => <div className="container mx-auto py-8">Blog Page</div>;

const App = () => {
    return (
        <Routes>
            <Route element={<Layout />}>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/resources/:id" element={<ResourceDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />

                {/* Protected User Routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/upload" element={<Upload />} />
                    <Route path="/dashboard" element={<UserDashboard />}>
                        <Route index element={<Navigate to="uploads" replace />} />
                        <Route path="uploads" element={<MyUploads />} />
                        <Route path="notifications" element={<Notifications />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Route>

                {/* Protected Admin Routes */}
                <Route path="/admin" element={<AdminRoute />}>
                    <Route element={<AdminDashboard />}>
                        <Route index element={<Navigate to="analytics" replace />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="users" element={<ManageUsers />} />
                        <Route path="approvals" element={<Approvals />} />
                        <Route path="flags" element={<Flags />} />
                    </Route>
                </Route>

                {/* Not Found */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
};

export default App;
