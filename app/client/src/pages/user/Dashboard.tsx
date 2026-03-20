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
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../../lib/auth";
import { useSession } from "../../lib/auth-client";
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
  const { data: session } = useSession();
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

  // Delegated permissions from live session
  interface SessionWithPerms { permissions?: { canApproveResources?: boolean; canResolveFlags?: boolean; canEditUsers?: boolean; canDeleteNodes?: boolean; }; }
  const sessionPerms = ((session?.user as SessionWithPerms)?.permissions || {});
  const hasDelegatedAuthority =
    sessionPerms.canApproveResources === true ||
    sessionPerms.canResolveFlags === true ||
    sessionPerms.canEditUsers === true ||
    sessionPerms.canDeleteNodes === true;


  return (
    <div className="min-h-screen bg-[#FAF8F4] dark:bg-[#0C0603] transition-colors duration-500 relative">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start relative">
          
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
            className={`fixed lg:sticky lg:top-16 inset-y-0 left-0 z-50 lg:z-auto w-72 flex flex-col gap-4 p-4 lg:p-0 bg-white dark:bg-[#1A0B04] lg:bg-transparent transform transition-all duration-500 ease-in-out ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            } ${isSidebarVisible ? "lg:w-72 lg:opacity-100" : "lg:w-0 lg:opacity-0 lg:pointer-events-none"}`}
          >
            <div className="bg-gradient-to-b from-[#5A270F] via-[#6C3B1C] to-[#2A1205] dark:from-[#1A0B04] dark:to-black rounded-3xl p-6 text-white relative overflow-hidden flex flex-col gap-6 shadow-2xl shadow-[#5A270F]/10 dark:shadow-none border border-white/5 h-full lg:h-auto min-h-[85vh]">
              {/* Pattern Overlays */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none architectural-dot-grid" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#DF8142]/10 blur-3xl translate-x-1/2 translate-y-1/2" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Profile Module */}
                <div className="flex flex-col items-center text-center pb-6 border-b border-white/10 mb-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-white blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-[#DF8142] to-[#EEB38C] flex items-center justify-center text-white text-lg font-black shadow-2xl relative z-10 border border-white/20 transform group-hover:scale-105 transition-transform duration-500">
                      {user?.first_name?.[0]}{user?.last_name?.[0]}
                    </div>
                  </div>
                  <h3 className="mt-4 text-sm font-black text-white leading-tight tracking-tight uppercase">
                    {user?.first_name} <br /> 
                    <span className="text-white/50">{user?.last_name}</span>
                  </h3>
                  <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/10 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-[0.15em] text-[#EEB38C]">
                    <Shield className="h-2.5 w-2.5" /> {userRole}
                  </div>
                </div>

                {/* Navigation Terminal */}
                <nav className="space-y-6 flex-grow overflow-y-auto scrollbar-none">
                  {/* General Back Protocol */}
                  <div className="px-2 mb-3">
                    <button
                      onClick={() => navigate(-1)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 bg-white/5 hover:bg-white/10 text-[#EEB38C] rounded-lg border border-white/10 transition-all text-[8px] font-black uppercase tracking-widest group"
                    >
                      <ArrowLeft className="h-2.5 w-2.5 group-hover:-translate-x-1 transition-transform" />
                      Protocol Return
                    </button>
                  </div>
 
                  {isAdmin && (
                    <div className="px-2 mb-4">
                       <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white text-white hover:text-[#5A270F] rounded-xl border border-white/10 transition-all duration-500 group shadow-lg"
                      >
                        <ShieldCheck className="h-4 w-4 text-[#DF8142]" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase tracking-[0.15em]">Admin Authority</span>
                          <span className="text-[6.5px] font-bold text-white/40 group-hover:text-[#5A270F]/40 uppercase tracking-widest leading-none">Command Center</span>
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* Authority Mandate shortcut for represented users */}
                  {!isAdmin && hasDelegatedAuthority && (
                    <div className="px-2 mb-4">
                      <Link
                        to="/dashboard/authority"
                        className="flex items-center gap-3 px-4 py-3 bg-violet-600/20 hover:bg-violet-600 text-violet-300 hover:text-white rounded-xl border border-violet-500/30 transition-all duration-500 group shadow-lg"
                      >
                        <Zap className="h-4 w-4 text-violet-400 group-hover:text-white animate-pulse" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase tracking-[0.15em]">Authority Mandate</span>
                          <span className="text-[6.5px] font-bold text-violet-400/60 group-hover:text-white/60 uppercase tracking-widest leading-none">Delegated Tasks Active</span>
                        </div>
                      </Link>
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <p className="px-4 text-[7px] font-black text-white/30 uppercase tracking-[0.3em] mb-3">
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
                            className={`group flex items-center justify-between px-4 py-2.5 rounded-xl text-[9.5px] font-black uppercase tracking-widest transition-all duration-500 ${
                              isActive
                                ? "bg-white text-[#5A270F] shadow-lg scale-[1.02]"
                                : "text-[#EEB38C]/50 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <link.icon className={`h-3.5 w-3.5 ${isActive ? "text-[#DF8142]" : "text-[#EEB38C]/30 group-hover:text-white"}`} />
                              <span>{link.name}</span>
                            </div>
                            {isActive && <div className="h-1 w-1 rounded-full bg-[#DF8142] animate-pulse" />}
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
          <main className={`flex-grow min-w-0 transition-all duration-500 ${isSidebarVisible ? "lg:max-w-[calc(100%-312px)]" : "lg:max-w-full"}`}>
            <div className="bg-white dark:bg-[#1A0B02] p-6 sm:p-8 rounded-2xl shadow-sm border border-[#D9D9C2] dark:border-white/10 min-h-[85vh] relative overflow-hidden transition-colors duration-500 text-[#5A270F] dark:text-[#EEB38C]">
              <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#D9D9C2]/40 dark:border-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  {/* Toggle Grip for Hidden State */}
                  {!isSidebarVisible && (
                    <button 
                      onClick={() => setIsSidebarVisible(true)}
                      className="hidden lg:flex p-2 bg-[#5A270F] text-white rounded-xl hover:scale-110 transition-transform shadow-md"
                      title="Show Sidebar"
                    >
                      <PanelLeftOpen className="h-4 w-4" />
                    </button>
                  )}
 
                  <div className="bg-[#5A270F] p-2.5 rounded-xl text-white shadow-md group">
                    {currentLink ? (
                      <currentLink.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <LayoutDashboard className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <div className="h-1 w-1 rounded-full bg-[#DF8142]" />
                      <p className="text-[8px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.2em] transition-colors">
                        Terminal Interface
                      </p>
                    </div>
                    <h1 className="text-xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tighter leading-none transition-colors uppercase italic">
                      {getTitle()}
                    </h1>
                  </div>
                </div>
                <div className="flex items-center gap-3">
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
