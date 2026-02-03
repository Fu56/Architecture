import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import {
  Upload,
  Bell,
  User,
  LayoutDashboard,
  Library,
  UploadCloud,
  BookOpen,
  PenTool,
  Shield,
  Activity,
  Terminal,
  ArrowLeft,
} from "lucide-react";
import { getUser } from "../../lib/auth";

const dashboardNavLinks = [
  {
    name: "Personal Console",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  { name: "Upload New", href: "/dashboard/upload", icon: UploadCloud },
  { name: "Asset Library", href: "/dashboard/resources", icon: Library },
  { name: "Assessments", href: "/dashboard/assignments", icon: BookOpen },
  { name: "My Archives", href: "/dashboard/uploads", icon: Upload },
  {
    name: "Journal Entry",
    href: "/dashboard/blog/new",
    icon: PenTool,
    role: "Faculty",
  },
  { name: "Signals", href: "/dashboard/notifications", icon: Bell },
  { name: "System Settings", href: "/dashboard/profile", icon: User },
];

const UserDashboard = () => {
  const location = useLocation();
  const user = getUser();
  const currentLink = [...dashboardNavLinks]
    .reverse()
    .find((l) =>
      l.exact
        ? location.pathname === l.href
        : location.pathname.startsWith(l.href),
    );

  const getTitle = () => {
    return currentLink?.name || "Member Dashboard";
  };

  const userRole =
    typeof user?.role === "object" ? user.role.name : user?.role || "Member";
  const isSuperAdmin = userRole === "SuperAdmin";

  return (
    <div className="min-h-screen bg-[#EFEDED] selection:bg-primary/20 selection:text-[#2A1205]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Immersive User Sidebar */}
          <aside className="w-full lg:w-[280px] lg:sticky lg:top-24 z-30">
            <div className="bg-[#2A1205] rounded-3xl p-6 shadow-xl relative overflow-hidden ring-1 ring-white/10 flex flex-col min-h-[85vh]">
              {/* Abstract Background pattern */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#DF8142]/10 blur-[40px] -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Profile Module */}
                <div className="flex flex-col items-center text-center pb-8 border-b border-white/5 mb-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-[#5A270F] blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#DF8142] to-[#5A270F] flex items-center justify-center text-white text-2xl font-bold shadow-xl relative z-10 border border-white/20 transform group-hover:scale-105 transition-transform duration-500">
                      {user?.first_name?.[0]}
                      {user?.last_name?.[0]}
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-white leading-tight tracking-tight">
                    {user?.first_name} <br /> {user?.last_name}
                  </h3>
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-[#EEB38C]/10 border border-[#DF8142]/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#DF8142]">
                    <Shield className="h-3 w-3" /> {userRole}
                  </div>
                </div>

                {isSuperAdmin && (
                  <Link
                    to="/super-admin"
                    className="mb-6 mx-2 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#EEB38C] hover:text-white transition-all group"
                  >
                    <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                    Back to Central Command
                  </Link>
                )}

                {/* Navigation Terminal */}
                <nav className="space-y-2 flex-grow">
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4 px-2 flex items-center gap-3">
                    <Terminal className="h-3 w-3" /> Personal Nexus
                  </p>
                  <div className="space-y-1.5">
                    {dashboardNavLinks
                      .filter((link) => !link.role || userRole === link.role)
                      .map((link) => {
                        const isActive = link.exact
                          ? location.pathname === link.href
                          : location.pathname.startsWith(link.href);
                        return (
                          <NavLink
                            key={link.name}
                            to={link.href}
                            end={link.exact}
                            className={`group flex items-center px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-500 ${
                              isActive
                                ? "bg-white text-[#2A1205] shadow-lg -translate-y-0.5"
                                : "text-white/40 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <link.icon
                              className={`mr-4 h-5 w-5 transition-transform duration-500 group-hover:scale-110 ${
                                isActive
                                  ? "text-[#2A1205]"
                                  : "text-white/20 group-hover:text-[#DF8142]"
                              }`}
                            />
                            <span>{link.name}</span>
                          </NavLink>
                        );
                      })}
                  </div>
                </nav>

                {/* Status Indicator */}
                <div className="mt-auto pt-8 border-t border-white/5">
                  <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#5A270F] animate-pulse" />
                      <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">
                        Node Online
                      </span>
                    </div>
                    <Activity className="h-3 w-3 text-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Integrated Workspace */}
          <main className="flex-grow w-full lg:max-w-[calc(100%-312px)]">
            <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-[#D9D9C2] min-h-[85vh] relative overflow-hidden">
              <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 pb-8 border-b border-slate-50">
                <div className="flex items-center gap-6">
                  <div className="bg-[#2A1205] p-3 rounded-2xl text-white shadow-lg group">
                    {currentLink ? (
                      <currentLink.icon className="h-8 w-8 group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <LayoutDashboard className="h-8 w-8" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#92664A]" />
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Subscriber Interface
                      </p>
                    </div>
                    <h1 className="text-3xl font-bold text-[#5A270F] tracking-tight leading-none">
                      {getTitle()}
                    </h1>
                  </div>
                </div>
              </header>

              <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
