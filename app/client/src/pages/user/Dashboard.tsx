import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Upload,
  Bell,
  User,
  LayoutDashboard,
  Library,
  UploadCloud,
  BookOpen,
  PenTool,
} from "lucide-react";
import { getUser } from "../../lib/auth";

const dashboardNavLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { name: "Upload New", href: "/dashboard/upload", icon: UploadCloud },
  { name: "My Library", href: "/dashboard/resources", icon: Library },
  { name: "Assignments", href: "/dashboard/assignments", icon: BookOpen },
  { name: "My Uploads", href: "/dashboard/uploads", icon: Upload },
  {
    name: "Post Blog",
    href: "/dashboard/blog/new",
    icon: PenTool,
    role: "Faculty",
  },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

const UserDashboard = () => {
  const location = useLocation();
  const user = getUser();
  const currentLink = [...dashboardNavLinks]
    .reverse()
    .find((l) =>
      l.exact
        ? location.pathname === l.href
        : location.pathname.startsWith(l.href)
    );

  const getTitle = () => {
    return currentLink?.name || "Dashboard";
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-80px)] bg-gray-50/20">
      <div className="md:grid md:grid-cols-12 md:gap-8 items-start">
        {/* Sidebar Navigation */}
        <aside className="md:col-span-3 lg:col-span-3 xl:col-span-2 mb-8 md:mb-0 sticky top-24">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 space-y-8">
            {/* User Profile Summary */}
            <div className="flex flex-col items-center text-center pb-6 border-b border-gray-50">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-lg mb-4 ring-4 ring-indigo-50">
                {user?.first_name?.[0]}
                {user?.last_name?.[0]}
              </div>
              <h3 className="font-black text-gray-900 leading-tight">
                {user?.first_name} <br /> {user?.last_name}
              </h3>
              <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-2 bg-indigo-50 px-3 py-1 rounded-full">
                {typeof user?.role === "object"
                  ? user.role.name
                  : user?.role || "Member"}
              </p>
            </div>

            <nav className="space-y-1.5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">
                Menu
              </p>
              {dashboardNavLinks
                .filter(
                  (link) =>
                    !link.role ||
                    (typeof user?.role === "object"
                      ? user.role.name
                      : user?.role) === link.role
                )
                .map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    end={link.exact}
                    className={({ isActive }) =>
                      `group flex items-center px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 -translate-y-0.5"
                          : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                      }`
                    }
                  >
                    <link.icon
                      className={`mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${
                        (
                          link.exact
                            ? location.pathname === link.href
                            : location.pathname.startsWith(link.href)
                        )
                          ? "text-white"
                          : "text-gray-400 group-hover:text-indigo-500"
                      }`}
                    />
                    <span>{link.name}</span>
                  </NavLink>
                ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:col-span-9 lg:col-span-9 xl:col-span-10">
          <div className="bg-white/90 backdrop-blur-2xl p-8 sm:p-12 rounded-[2rem] shadow-2xl shadow-gray-200/80 border border-white min-h-[700px]">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
                  {currentLink && <currentLink.icon className="h-7 w-7" />}
                </div>
                <div>
                  <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                    {getTitle()}
                  </h1>
                  <p className="text-gray-400 text-sm font-medium">
                    Personal Workspace
                  </p>
                </div>
              </div>
            </header>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default UserDashboard;
