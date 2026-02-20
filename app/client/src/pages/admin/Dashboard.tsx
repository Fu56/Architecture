import { useState } from "react";
import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import {
  Users,
  CheckSquare,
  Flag,
  BarChart2,
  UserPlus,
  FileSpreadsheet,
  Library,
  UploadCloud,
  PenTool,
  Megaphone,
  ShieldCheck,
  Layout,
  Command,
  Bell,
  ArrowLeft,
  User,
  LayoutDashboard,
  Heart,
  Menu,
  X,
} from "lucide-react";

import { getUser } from "../../lib/auth";

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
  { name: "Resources", href: "/admin/resources", icon: Library },
  { name: "Upload Resource", href: "/admin/upload", icon: UploadCloud },
  { name: "Post Blog", href: "/admin/blog/new", icon: PenTool },
  { name: "News & Events", href: "/admin/news", icon: Megaphone },
  { name: "Flagged Content", href: "/admin/flags", icon: Flag },
  { name: "Signals", href: "/admin/notifications", icon: Bell },
  { name: "Saved Resources", href: "/admin/favorites", icon: Heart },
  { name: "Personal Console", href: "/dashboard", icon: LayoutDashboard },
  { name: "System Settings", href: "/dashboard/profile", icon: User },
];

import DeptHeadDashboard from "./DeptHeadDashboard";

const AdminDashboard = () => {
  const location = useLocation();
  const user = getUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(location.pathname);

  // Close sidebar on mobile when navigating
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }

  const currentLink = [...adminNavLinks]
    .reverse()
    .find((l) => location.pathname.startsWith(l.href));

  const role = typeof user?.role === "object" ? user.role.name : user?.role;
  const isSuperAdmin = role === "SuperAdmin";

  if (role === "DepartmentHead") {
    return <DeptHeadDashboard />;
  }

  const getTitle = () => {
    return currentLink?.name || "Admin Dashboard";
  };

  return (
    <div className="min-h-screen bg-[#EFEDED] selection:bg-primary/20 selection:text-[#2A1205] relative">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-8 right-8 z-[60] h-16 w-16 bg-[#2A1205] text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform hover:bg-[#5A270F] border-4 border-white/20"
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6 animate-in spin-in-90 duration-300" />
        ) : (
          <Menu className="h-6 w-6 animate-in zoom-in duration-300" />
        )}
      </button>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-[#2A1205]/60 backdrop-blur-md z-40 animate-in fade-in duration-300"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Refined Admin Sidebar */}
          <aside
            className={`fixed lg:sticky lg:top-24 inset-y-0 left-0 z-50 lg:z-auto w-full max-w-[300px] lg:w-[280px] bg-[#2A1205] lg:bg-transparent transform transition-transform duration-500 ease-in-out lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
          >
            <div className="bg-[#2A1205] rounded-3xl lg:rounded-3xl p-6 shadow-xl relative overflow-hidden ring-1 ring-white/10 flex flex-col h-[calc(100vh-80px)] lg:h-[calc(100vh-140px)]">
              {/* Architectural Grid Pattern Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none architectural-dot-grid" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#DF8142]/10 blur-[60px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#92664A]/5 blur-[40px] translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Profile Module - Re-imagined */}
                <div className="flex flex-col items-center text-center pb-6 border-b border-white/5 mb-6">
                  {/* ... profile icon ... */}
                  <div className="relative group p-1 rounded-2xl bg-gradient-to-br from-[#DF8142]/30 to-[#92664A]/30">
                    <div className="absolute inset-0 bg-[#DF8142] blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
                    <div className="h-16 w-16 rounded-xl bg-[#5A270F] flex items-center justify-center text-white text-xl font-bold relative z-10 border border-white/10 overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#DF8142]/40 to-transparent" />
                      <span className="relative z-10">
                        {user?.first_name?.[0]}
                        {user?.last_name?.[0]}
                      </span>
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-white leading-tight tracking-tight px-4">
                    {user?.first_name} <br />
                    <span className="text-white/60 font-medium">
                      {user?.last_name}
                    </span>
                  </h3>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-[#DF8142]/10 border border-[#DF8142]/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#DF8142]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {typeof user?.role === "string"
                      ? user.role
                      : user?.role?.name || "ADMIN_CORE"}
                  </div>
                </div>

                {isSuperAdmin && (
                  <Link
                    to="/super-admin"
                    className="mb-6 mx-2 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#EEB38C] hover:text-white transition-all group"
                  >
                    <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                    Back to Command
                  </Link>
                )}

                {/* Navigation Terminal */}
                <nav className="flex-grow overflow-y-auto pr-2 -mr-2 scrollbar-none space-y-2">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-3">
                      <Command className="h-3 w-3" /> Control Modules
                    </p>
                    <div className="h-px flex-grow ml-4 bg-white/5" />
                  </div>
                  <div className="space-y-2">
                    {adminNavLinks.map((link) => {
                      const isActive = location.pathname.startsWith(link.href);
                      return (
                        <NavLink
                          key={link.name}
                          to={link.href}
                          className={`group relative flex items-center px-4 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-500 ${
                            isActive
                              ? "bg-white text-[#2A1205] shadow-lg -translate-y-0.5"
                              : "text-white/40 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <link.icon
                            className={`mr-4 h-5 w-5 transition-all duration-500 ${
                              isActive
                                ? "text-[#DF8142] scale-110"
                                : "text-white/20 group-hover:text-[#DF8142]/80 group-hover:scale-110"
                            }`}
                          />
                          <span className="relative z-10">{link.name}</span>
                          {isActive && (
                            <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-[#DF8142] shadow-[0_0_10px_rgba(223,129,66,1)]" />
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Workspace */}
          <main className="flex-grow w-full lg:max-w-[calc(100%-312px)] min-w-0">
            <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-[#D9D9C2] min-h-[calc(100vh-140px)] relative overflow-hidden flex flex-col">
              <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-50 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-[#DF8142] blur-lg opacity-10 group-hover:opacity-20 transition-opacity" />
                    <div className="bg-[#5A270F] p-3 rounded-2xl text-white shadow-xl relative z-10 group-hover:scale-110 transition-transform duration-500">
                      {currentLink ? (
                        <currentLink.icon className="h-6 w-6" />
                      ) : (
                        <Layout className="h-6 w-6" />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#DF8142]/90" />
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        Executive Command
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

export default AdminDashboard;
