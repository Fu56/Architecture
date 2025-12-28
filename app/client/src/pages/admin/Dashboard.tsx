import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Users,
  CheckSquare,
  Flag,
  BarChart2,
  UserPlus,
  FileSpreadsheet,
} from "lucide-react";

const adminNavLinks = [
  { name: "Analytics", href: "/admin/analytics", icon: BarChart2 },
  { name: "Manage Users", href: "/admin/users", icon: Users },
  {
    name: "Register Students",
    href: "/admin/register-students",
    icon: FileSpreadsheet,
  },
  { name: "Register Faculty", href: "/admin/register-faculty", icon: UserPlus },
  { name: "Resource Approvals", href: "/admin/approvals", icon: CheckSquare },
  { name: "Flagged Content", href: "/admin/flags", icon: Flag },
];

const AdminDashboard = () => {
  const location = useLocation();
  const getTitle = () => {
    return (
      adminNavLinks.find((l) => location.pathname.includes(l.href))?.name ||
      "Admin Dashboard"
    );
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:grid md:grid-cols-12 md:gap-8">
        {/* Sidebar Navigation */}
        <aside className="md:col-span-3 lg:col-span-2 mb-8 md:mb-0">
          <nav className="space-y-1">
            {adminNavLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-indigo-100 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <link.icon className="mr-3 h-5 w-5" />
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-9 lg:col-span-10">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
              {getTitle()}
            </h1>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
