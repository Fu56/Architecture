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
  const currentLink = [...adminNavLinks]
    .reverse()
    .find((l) => location.pathname.startsWith(l.href));

  const getTitle = () => {
    return currentLink?.name || "Admin Dashboard";
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-80px)] bg-gray-50/50 rounded-3xl">
      <div className="md:grid md:grid-cols-12 md:gap-8 items-start">
        {/* Sidebar Navigation */}
        <aside className="md:col-span-3 lg:col-span-2 mb-8 md:mb-0 sticky top-24">
          <nav className="space-y-2">
            {adminNavLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105"
                      : "text-gray-600 bg-white hover:bg-gray-50 hover:text-indigo-600 hover:shadow-md"
                  }`
                }
              >
                <link.icon
                  className={`mr-3 h-5 w-5 transition-colors ${
                    location.pathname.startsWith(link.href)
                      ? "text-indigo-100"
                      : "text-gray-400 group-hover:text-indigo-500"
                  }`}
                />
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-9 lg:col-span-10">
          <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-10 rounded-2xl shadow-xl border border-white/50">
            <h1 className="text-3xl font-black text-gray-900 mb-8 pb-4 border-b border-gray-100 flex items-center gap-3">
              <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                {currentLink && <currentLink.icon className="h-6 w-6" />}
              </span>
              {getTitle()}
            </h1>
            <div className="">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
