import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/ui/Layout";
import Home from "./pages/Home";
import Browse from "./pages/library/Browse";
import ResourceDetails from "./pages/library/ResourceDetails";
import Upload from "./pages/library/Upload";
import Login from "./pages/auth/Login";
import ResetPassword from "./pages/auth/ResetPassword";
import UserDashboard from "./pages/user/Dashboard";
import MyUploads from "./pages/user/MyUploads";
import Notifications from "./pages/user/Notifications";
import Overview from "./pages/user/Overview";
import Profile from "./pages/user/Profile";
import AdminDashboard from "./pages/admin/Dashboard";
import Analytics from "./pages/admin/Analytics";
import ManageUsers from "./pages/admin/ManageUsers";
import Approvals from "./pages/admin/Approvals";
import Flags from "./pages/admin/Flags";
import RegisterStudents from "./pages/admin/RegisterStudents";
import RegisterFaculty from "./pages/admin/RegisterFaculty";
import NewsManager from "./pages/admin/NewsManager";
import Resources from "./pages/dashboard/Resources";
import Assignments from "./pages/library/Assignments";
import AssignmentDetails from "./pages/library/AssignmentDetails";
import PostAssignment from "./pages/library/PostAssignment";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import SuperAdminRoute from "./routes/SuperAdminRoute";
import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import ManageDeptHeads from "./pages/superadmin/ManageDeptHeads";
import SystemLogs from "./pages/superadmin/SystemLogs";
import SuperAdminSettings from "./pages/superadmin/Settings";
import BlogDetails from "./pages/library/BlogDetails";
import PostBlog from "./pages/library/PostBlog";
import Privacy from "./pages/Privacy"; // Added
import Terms from "./pages/Terms"; // Added
import ScrollToTop from "./components/utils/ScrollToTop"; // Added

// Placeholder pages for static content
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog";
import Explore from "./pages/Explore";
import News from "./pages/News";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/resources/:id" element={<ResourceDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/news" element={<News />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Privacy />} />{" "}
          {/* Placeholder to Privacy for now */}
          <Route path="/ethics" element={<Terms />} />{" "}
          {/* Placeholder to Terms for now */}
          <Route path="/legal" element={<Terms />} />{" "}
          {/* Placeholder to Terms for now */}
          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<UserDashboard />}>
              {/* Default redirect when visiting /dashboard */}
              <Route index element={<Overview />} />
              <Route path="upload" element={<Upload />} />
              <Route path="uploads" element={<MyUploads />} />
              <Route path="resources" element={<Resources />} />
              <Route path="resources/:id" element={<ResourceDetails />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="assignments/:id" element={<AssignmentDetails />} />
              <Route path="assignments/new" element={<PostAssignment />} />
              <Route path="blog/new" element={<PostBlog />} />
            </Route>
          </Route>
          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminDashboard />}>
              {/* Default redirect when visiting /admin */}
              <Route index element={<Navigate to="analytics" replace />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="resources" element={<Resources />} />
              <Route path="resources/:id" element={<ResourceDetails />} />
              <Route path="upload" element={<Upload />} />
              <Route path="register-students" element={<RegisterStudents />} />
              <Route path="register-faculty" element={<RegisterFaculty />} />
              <Route path="approvals" element={<Approvals />} />
              <Route path="news" element={<NewsManager />} />
              <Route path="flags" element={<Flags />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="assignments/:id" element={<AssignmentDetails />} />
              <Route path="assignments/new" element={<PostAssignment />} />
              <Route path="blog/new" element={<PostBlog />} />
            </Route>
          </Route>
          {/* Protected Super Admin Routes */}
          <Route path="/super-admin" element={<SuperAdminRoute />}>
            <Route element={<SuperAdminDashboard />}>
              <Route index element={<Navigate to="dept-heads" replace />} />
              <Route path="dept-heads" element={<ManageDeptHeads />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="logs" element={<SystemLogs />} />
              <Route path="settings" element={<SuperAdminSettings />} />
              <Route path="system-stats" element={<Analytics />} />{" "}
              {/* Placeholder to Analytics */}
            </Route>
          </Route>
          {/* Not Found */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
