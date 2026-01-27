import { NavLink, Outlet, useLocation } from "react-router-dom";
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
];

const AdminDashboard = () => {
  const location = useLocation();
  const user = getUser();
  const currentLink = [...adminNavLinks]
    .reverse()
    .find((l) => location.pathname.startsWith(l.href));

  const getTitle = () => {
    return currentLink?.name || "Admin Dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Refined Admin Sidebar */}
          <aside className="w-full lg:w-[280px] lg:sticky lg:top-24 z-30">
            <div className="bg-slate-950 rounded-3xl p-6 shadow-xl relative overflow-hidden ring-1 ring-white/10 flex flex-col h-[calc(100vh-140px)]">
              {/* Architectural Grid Pattern Overlay */}
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/10 blur-[60px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-600/5 blur-[40px] translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Profile Module - Re-imagined */}
                <div className="flex flex-col items-center text-center pb-6 border-b border-white/5 mb-6">
                  <div className="relative group p-1 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30">
                    <div className="absolute inset-0 bg-indigo-600 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
                    <div className="h-16 w-16 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xl font-bold relative z-10 border border-white/10 overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/40 to-transparent" />
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
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    SYSTEM_ADMIN_CORE
                  </div>
                </div>

                {/* Navigation Terminal - With custom scrollbar */}
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
                              ? "bg-white text-slate-950 shadow-lg -translate-y-0.5"
                              : "text-white/40 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <link.icon
                            className={`mr-4 h-5 w-5 transition-all duration-500 ${
                              isActive
                                ? "text-indigo-600 scale-110"
                                : "text-white/20 group-hover:text-indigo-400 group-hover:scale-110"
                            }`}
                          />
                          <span className="relative z-10">{link.name}</span>
                          {isActive && (
                            <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,1)]" />
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                </nav>

                {/* Footer Insight */}
                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between px-2">
                  <div className="flex flex-col">
                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest text-[8px]">
                      Registry Node
                    </p>
                    <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
                      01-ADM-MASTER
                    </p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Workspace */}
          <main className="flex-grow w-full lg:max-w-[calc(100%-312px)]">
            <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-sm border border-slate-100 min-h-[calc(100vh-140px)] relative overflow-hidden flex flex-col">
              <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-50 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-indigo-600 blur-lg opacity-10 group-hover:opacity-20 transition-opacity" />
                    <div className="bg-slate-950 p-3 rounded-2xl text-white shadow-xl relative z-10 group-hover:scale-110 transition-transform duration-500">
                      {currentLink ? (
                        <currentLink.icon className="h-6 w-6" />
                      ) : (
                        <Layout className="h-6 w-6" />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Executive Command
                      </p>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">
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
