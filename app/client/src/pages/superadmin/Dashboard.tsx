import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  ShieldAlert,
  Users,
  Activity,
  Globe,
  BarChart3,
  ExternalLink,
  Settings,
  Menu,
  X,
} from "lucide-react";
import ThemeToggle from "../../components/ui/ThemeToggle";

const SuperAdminDashboard = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [prevPath, setPrevPath] = useState(location.pathname);
  const isSettingsPage = location.pathname === "/super-admin/settings";

  // Close sidebar on mobile when navigating (Recommended Pattern)
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }

  return (
    <div
      className={`relative flex flex-col lg:flex-row min-h-[calc(100vh-100px)] gap-8 animate-in fade-in duration-700 ${isSettingsPage ? "justify-center" : ""}`}
    >
      {/* Mobile Menu Toggle */}
      {!isSettingsPage && (
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
      )}

      {/* Super Sidebar */}
      {!isSettingsPage && (
        <>
          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-[#2A1205]/60 backdrop-blur-md z-40 animate-in fade-in duration-300"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <aside
            className={`fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto w-80 lg:w-80 flex flex-col gap-6 p-6 lg:p-0 bg-white dark:bg-card dark:bg-[#1A0B04] lg:bg-transparent lg:dark:bg-transparent transform transition-transform duration-500 ease-in-out lg:translate-x-0 ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="bg-[#5A270F] dark:bg-[#2A1205] rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col gap-8 shadow-2xl shadow-black/10 dark:shadow-none border border-transparent dark:border-white/5 h-full lg:h-auto transition-colors duration-500">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#DF8142]/10 blur-3xl -translate-x-1/2 translate-y-1/2" />

              <div className="space-y-4 relative z-10">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">
                  Core Authority
                </h2>
                <nav className="space-y-2">
                  {[
                    { to: "dept-heads", label: "Dept Heads", icon: Users },
                    { to: "logs", label: "System Logs", icon: Activity },
                    { to: "analytics", label: "Global Intel", icon: BarChart3 },
                  ].map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group ${
                          isActive
                            ? "bg-white dark:bg-[#EEB38C] text-[#5A270F] dark:text-[#1A0B02] shadow-xl shadow-black/20 dark:shadow-none"
                            : "text-[#EEB38C]/60 hover:text-[#5A270F] dark:hover:text-[#1A0B02] hover:bg-white dark:hover:bg-[#EEB38C] hover:shadow-xl dark:shadow-none"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </div>

              <div className="space-y-4 relative z-10">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">
                  Master Override
                </h2>
                <nav className="space-y-2">
                  {[
                    { to: "/admin", label: "Admin Nexus", icon: Globe },
                    {
                      to: "/dashboard",
                      label: "User Layer",
                      icon: ExternalLink,
                    },
                    {
                      to: "settings",
                      label: "System Settings",
                      icon: Settings,
                    },
                  ].map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group ${
                          isActive
                            ? "bg-white dark:bg-[#EEB38C] text-[#5A270F] dark:text-[#1A0B02] shadow-xl shadow-black/20 dark:shadow-none"
                            : "text-[#EEB38C]/60 hover:text-[#5A270F] dark:hover:text-[#1A0B02] hover:bg-white dark:hover:bg-[#EEB38C] hover:shadow-xl dark:shadow-none"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#DF8142] to-[#92664A] rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-end min-h-[180px] shadow-lg shadow-[#DF8142]/20 hidden lg:flex">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 dark:bg-card/20 blur-3xl" />
              <ShieldAlert className="h-4 w-4 mb-4 relative z-10 text-white/60" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] relative z-10 text-[#2A1205]/40">
                Security Protocol
              </p>
              <h3 className="text-xl font-black relative z-10">
                Developer Mode
              </h3>
            </div>
          </aside>
        </>
      )}

      {/* Main Content Node */}
      <main
        className={`flex-1 min-w-0 ${isSettingsPage ? "max-w-6xl w-full" : ""}`}
      >
        <div className="bg-white dark:bg-card p-6 sm:p-10 rounded-3xl shadow-sm border border-[#D9D9C2] dark:border-white/10 min-h-[calc(100vh-140px)] relative overflow-hidden flex flex-col transition-colors duration-500">
          <header className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50 dark:border-white/5">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#DF8142]" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5A270F]/40 dark:text-white/40">
                Central Node Alpha
              </p>
            </div>
            <ThemeToggle isScrolled={true} isHomePage={false} />
          </header>
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
