import { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  ShieldAlert,
  Users,
  BarChart3,
  Menu,
  X,
  FileSpreadsheet,
  UserPlus,
  CheckSquare,
  Library,
  UploadCloud,
  PenTool,
  Megaphone,
  Flag,
  Bell,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import ThemeToggle from "../../components/ui/ThemeToggle";

const DeptHeadDashboard = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [prevPath, setPrevPath] = useState(location.pathname);
  const isSettingsPage = location.pathname === "/dashboard/profile"; // mapped to local profile usually

  // Close sidebar on mobile when navigating
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }

  return (
    <div
      className={`relative flex flex-col lg:flex-row min-h-[calc(100vh-100px)] animate-in fade-in duration-700 ${isSettingsPage ? "justify-center" : ""}`}
    >
      {/* Mobile Menu Toggle */}
      {!isSettingsPage && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-8 right-8 z-[60] h-16 w-16 bg-[#5A270F] text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform hover:bg-[#5A270F] border-4 border-white/20"
          title={isSidebarOpen ? "Close Menu" : "Open Menu"}
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6 animate-in spin-in-90 duration-300" />
          ) : (
            <Menu className="h-6 w-6 animate-in zoom-in duration-300" />
          )}
        </button>
      )}

      {/* Desktop Visibility Toggle Side-Grip */}
      {!isSettingsPage && (
        <button 
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
          className={`hidden lg:flex fixed top-1/2 -translate-y-1/2 z-[100] h-12 w-6 items-center justify-center bg-[#5A270F] text-white rounded-r-xl shadow-xl hover:w-8 transition-all duration-300 border-y border-r border-white/10 ${isSidebarVisible ? "left-0 opacity-0 pointer-events-none" : "left-0"}`}
          title="Show Sidebar"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}

      {/* Dept Head Sidebar (Unified Premium Style) */}
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
            className={`fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto w-80 lg:w-80 flex flex-col gap-6 p-6 lg:p-0 bg-white dark:bg-card dark:bg-[#1A0B04] lg:bg-transparent lg:dark:bg-transparent transform transition-all duration-500 ease-in-out ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            } ${isSidebarVisible ? "lg:w-80 lg:opacity-100 lg:mr-8" : "lg:w-0 lg:opacity-0 lg:mr-0 lg:pointer-events-none overflow-hidden"}`}
          >
            <div className="bg-gradient-to-b from-[#5A270F] via-[#6C3B1C] to-[#2A1205] dark:from-[#1A0B04] dark:to-black rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col gap-8 shadow-2xl shadow-black/10 dark:shadow-none border border-white/5 h-full lg:h-auto min-h-[85vh] transition-colors duration-500">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#DF8142]/10 blur-3xl -translate-x-1/2 translate-y-1/2" />
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none architectural-dot-grid" />

              <div className="space-y-4 relative z-10">
                <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">
                  Department Authority
                </h2>
                <nav className="space-y-2">
                  {[
                    { to: "analytics", label: "Analytics", icon: BarChart3 },
                    { to: "users", label: "Manage Users", icon: Users },
                    {
                      to: "approvals",
                      label: "Resource Approvals",
                      icon: CheckSquare,
                    },
                    { to: "flags", label: "Flagged Content", icon: Flag },
                  ].map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group ${
                          isActive
                            ? "bg-white text-[#5A270F] shadow-xl shadow-black/20 scale-[1.02]"
                            : "text-[#EEB38C]/60 hover:text-white hover:bg-white/5"
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
                <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">
                  Operations
                </h2>
                <nav className="space-y-2">
                  {[
                    {
                      to: "register-students",
                      label: "Register Students",
                      icon: FileSpreadsheet,
                    },
                    {
                      to: "register-faculty",
                      label: "Register Faculty",
                      icon: UserPlus,
                    },
                    { to: "resources", label: "Resources", icon: Library },
                    {
                      to: "upload",
                      label: "Upload Resource",
                      icon: UploadCloud,
                    },
                    { to: "blog/new", label: "Post Blog", icon: PenTool },
                    { to: "news", label: "News & Events", icon: Megaphone },
                  ].map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group ${
                          isActive
                            ? "bg-white text-[#5A270F] shadow-xl shadow-black/20 scale-[1.02]"
                            : "text-[#EEB38C]/60 hover:text-white hover:bg-white/5"
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
                <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">
                  System
                </h2>
                <nav className="space-y-2">
                  {[
                    { to: "notifications", label: "Signals", icon: Bell },
                    {
                      to: "/dashboard",
                      label: "Personal Console",
                      icon: LayoutDashboard,
                    },
                  ].map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group ${
                          isActive
                            ? "bg-white text-[#5A270F] shadow-xl shadow-black/20 scale-[1.02]"
                            : "text-[#EEB38C]/60 hover:text-white hover:bg-white/5"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </div>

              <button 
                onClick={() => setIsSidebarVisible(false)}
                className="hidden lg:flex items-center gap-3 px-6 py-4 mt-auto rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:bg-white/5 transition-all group"
                title="Hide Sidebar"
              >
                <PanelLeftClose className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Hide Sidebar
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#DF8142] to-[#92664A] rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-end min-h-[180px] shadow-lg shadow-[#DF8142]/20 hidden lg:flex">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 dark:bg-card/20 blur-3xl" />
              <ShieldAlert className="h-4 w-4 mb-4 relative z-10 text-white/60" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] relative z-10 text-[#2A1205]/40">
                Protocol Level
              </p>
              <h3 className="text-xl font-black relative z-10 uppercase">
                Dept Head
              </h3>
            </div>
          </aside>
        </>
      )}

      {/* Main Content Node */}
      <main
        className={`flex-1 min-w-0 transition-all duration-500 ${isSettingsPage ? "max-w-6xl w-full" : isSidebarVisible ? "lg:max-w-[calc(100%-352px)]" : "lg:max-w-full"}`}
      >
        <div className="bg-white dark:bg-card p-6 sm:p-10 rounded-3xl shadow-sm border border-[#D9D9C2] dark:border-white/10 min-h-[calc(100vh-140px)] relative overflow-hidden flex flex-col transition-colors duration-500">
          <header className={`flex items-center justify-between mb-8 pb-6 border-b border-slate-50 dark:border-white/5 ${!isSidebarVisible && !isSettingsPage ? "pl-2" : ""}`}>
            <div className="flex items-center gap-6">
              {/* Toggle Grip for Hidden State */}
              {!isSidebarVisible && !isSettingsPage && (
                <button 
                  onClick={() => setIsSidebarVisible(true)}
                  className="hidden lg:flex p-3 bg-[#5A270F] text-white rounded-2xl hover:scale-110 transition-transform shadow-lg"
                  title="Show Sidebar"
                >
                  <PanelLeftOpen className="h-6 w-6" />
                </button>
              )}
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#DF8142]" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#5A270F]/40 dark:text-white/40">
                  Department Node
                </p>
              </div>
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

export default DeptHeadDashboard;
