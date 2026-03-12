import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Archive,
  Bell,
  LayoutDashboard,
  Library,
  UploadCloud,
  BookOpen,
  PenTool,
  Shield,
  Heart,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../../lib/auth";
import ThemeToggle from "../../components/ui/ThemeToggle";

const dashboardNavLinks = [
  {
    name: "Personal Console",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
    hideForAdmin: true,
  },
  { name: "Upload New", href: "/dashboard/upload", icon: UploadCloud },
  { name: "Saved Resources", href: "/dashboard/favorites", icon: Heart },
  { name: "Asset Library", href: "/dashboard/resources", icon: Library },
  { name: "Assessments", href: "/dashboard/assignments", icon: BookOpen },
  { name: "My Archives", href: "/dashboard/uploads", icon: Archive },
  {
    name: "Journal Entry",
    href: "/dashboard/blog/new",
    icon: PenTool,
    role: "Faculty",
  },
  { name: "Signals", href: "/dashboard/notifications", icon: Bell },
  { name: "System Settings", href: "/dashboard/profile", icon: Shield },
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [prevPath, setPrevPath] = useState(location.pathname);

  // Close sidebar on mobile when navigating
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }

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
  const isDeptHead = userRole === "DepartmentHead";
  const isAdmin =
    userRole === "Admin" || userRole === "admin" || isSuperAdmin || isDeptHead;

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#0F0602] lg:bg-[#EFEDED] dark:bg-background lg:dark:bg-[#0F0602] transition-colors duration-500 relative">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* Mobile Menu Toggle (Floating) */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden fixed bottom-8 right-8 z-[60] h-16 w-16 bg-[#5A270F] text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-all border-4 border-white/20"
            title={isSidebarOpen ? "Close Menu" : "Open Menu"}
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Visibility Toggle Side-Grip */}
          <button 
            onClick={() => setIsSidebarVisible(!isSidebarVisible)}
            className={`hidden lg:flex fixed top-1/2 -translate-y-1/2 z-[100] h-12 w-6 items-center justify-center bg-[#5A270F] text-white rounded-r-xl shadow-xl hover:w-8 transition-all duration-300 border-y border-r border-white/10 ${isSidebarVisible ? "left-0 opacity-0 pointer-events-none" : "left-0"}`}
            title="Show Sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>

          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-[#2A1205]/60 backdrop-blur-md z-40 animate-in fade-in duration-300"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Immersive User Sidebar (Dept Head Style) */}
          <aside
            className={`fixed lg:sticky lg:top-24 inset-y-0 left-0 z-50 lg:z-auto w-80 flex flex-col gap-6 p-6 lg:p-0 bg-white dark:bg-[#1A0B04] lg:bg-transparent transform transition-all duration-500 ease-in-out ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            } ${isSidebarVisible ? "lg:w-80 lg:opacity-100" : "lg:w-0 lg:opacity-0 lg:pointer-events-none"}`}
          >
            <div className="bg-gradient-to-b from-[#5A270F] via-[#6C3B1C] to-[#2A1205] dark:from-[#1A0B04] dark:to-black rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col gap-8 shadow-2xl shadow-[#5A270F]/10 dark:shadow-none border border-white/5 h-full lg:h-auto min-h-[85vh]">
              {/* Pattern Overlays */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none architectural-dot-grid" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#DF8142]/10 blur-3xl translate-x-1/2 translate-y-1/2" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Profile Module */}
                <div className="flex flex-col items-center text-center pb-8 border-b border-white/10 mb-8">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-white blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#DF8142] to-[#EEB38C] flex items-center justify-center text-white text-2xl font-black shadow-2xl relative z-10 border border-white/20 transform group-hover:scale-105 transition-transform duration-500">
                      {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </div>
                  </div>
                  <h3 className="mt-5 text-lg font-black text-white leading-tight tracking-tight uppercase">
                    {user?.first_name} <br /> 
                    <span className="text-white/50">{user?.last_name}</span>
                  </h3>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-[#EEB38C]">
                    <Shield className="h-3 w-3" /> {userRole}
                  </div>
                </div>

                {/* Navigation Terminal */}
                <nav className="space-y-6 flex-grow overflow-y-auto scrollbar-none">
                  {/* General Back Protocol */}
                  <div className="px-4 mb-4">
                    <button
                      onClick={() => navigate(-1)}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-[#EEB38C] rounded-xl border border-white/10 transition-all text-[9.5px] font-black uppercase tracking-widest group"
                    >
                      <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                      Back to Context
                    </button>
                  </div>

                  {isAdmin && (
                    <div className="px-4 mb-8">
                       <Link
                        to="/admin"
                        className="flex items-center gap-4 px-6 py-4 bg-white/10 hover:bg-white text-white hover:text-[#5A270F] rounded-2xl border border-white/10 transition-all duration-500 group shadow-lg"
                      >
                        <ShieldCheck className="h-5 w-5 text-[#DF8142]" />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Center</span>
                          <span className="text-[7px] font-bold text-white/40 group-hover:text-[#5A270F]/40 uppercase tracking-widest mt-0.5">Admin Protocol</span>
                        </div>
                      </Link>
                    </div>
                  )}
                  <div className="space-y-3">
                    <p className="px-4 text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">
                      Personal Nexus
                    </p>
                    {dashboardNavLinks
                      .filter((link) => !link.role || userRole === link.role)
                      .filter((link) => !(isAdmin && "hideForAdmin" in link && link.hideForAdmin))
                      .map((link) => {
                        const isActive = link.exact
                          ? location.pathname === link.href
                          : location.pathname.startsWith(link.href);
                        return (
                          <NavLink
                            key={link.name}
                            to={link.href}
                            end={link.exact}
                            className={`group flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                              isActive
                                ? "bg-white text-[#5A270F] shadow-xl shadow-black/20 scale-[1.02]"
                                : "text-[#EEB38C]/60 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <link.icon className={`h-4 w-4 ${isActive ? "text-[#DF8142]" : "text-[#EEB38C]/40 group-hover:text-white"}`} />
                              <span>{link.name}</span>
                            </div>
                            {isActive && <div className="h-1.5 w-1.5 rounded-full bg-[#DF8142] animate-pulse" />}
                          </NavLink>
                        );
                      })}
                  </div>
                </nav>

                <button 
                  onClick={() => setIsSidebarVisible(false)}
                  className="hidden lg:flex items-center gap-3 px-6 py-4 mt-8 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:bg-white/5 transition-all group"
                  title="Hide Sidebar"
                >
                  <PanelLeftClose className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Hide Console
                </button>
              </div>
            </div>
          </aside>

          {/* Main Integrated Workspace */}
          <main className={`flex-grow min-w-0 transition-all duration-500 ${isSidebarVisible ? "lg:max-w-[calc(100%-344px)]" : "lg:max-w-full"}`}>
            <div className="bg-white dark:bg-card p-6 sm:p-10 rounded-3xl shadow-sm border border-[#D9D9C2] dark:border-white/10 min-h-[85vh] relative overflow-hidden transition-colors duration-500">
              <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 pb-8 border-b border-slate-50 dark:border-white/5 transition-colors">
                <div className="flex items-center gap-6">
                  {/* Toggle Grip for Hidden State */}
                  {!isSidebarVisible && (
                    <button 
                      onClick={() => setIsSidebarVisible(true)}
                      className="hidden lg:flex p-3 bg-[#5A270F] text-white rounded-2xl hover:scale-110 transition-transform shadow-lg"
                      title="Show Sidebar"
                    >
                      <PanelLeftOpen className="h-6 w-6" />
                    </button>
                  )}

                  <div className="bg-[#5A270F] p-3 rounded-2xl text-white shadow-lg group">
                    {currentLink ? (
                      <currentLink.icon className="h-6 w-6 group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <LayoutDashboard className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#DF8142]" />
                      <p className="text-[10px] font-bold text-[#5A270F] dark:text-[#EEB38C]/60 uppercase tracking-[0.3em] transition-colors">
                        Architect Interface
                      </p>
                    </div>
                    <h1 className="text-3xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter leading-none transition-colors uppercase">
                      {getTitle()}
                    </h1>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <ThemeToggle isScrolled={true} isHomePage={false} />
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
