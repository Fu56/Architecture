import { useState, useEffect } from "react";
import {
  Outlet,
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Menu,
  X,
  BookOpen,
  User,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  Upload,
  Bell,
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { useSession, authClient } from "../../lib/auth-client";
import { api } from "../../lib/api";
import { syncSessionToStorage } from "../../lib/auth";
import Footer from "./Footer";
import ThemeToggle from "./ThemeToggle";
import { Toaster } from "./sonner";
import { toast } from "../../lib/toast";

interface UserWithRole {
  id: string | number;
  email: string;
  name?: string;
  first_name?: string;
  firstName?: string;
  role?: { name: string } | string;
}

const Layout = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: session } = useSession();
  const user = session?.user as UserWithRole | undefined;

  // Sync session to storage for legacy components
  useEffect(() => {
    syncSessionToStorage();
  }, [session]);

  // Fetch unread notification count with cleanup to avoid cascading renders
  useEffect(() => {
    let isMounted = true;

    const updateNotificationCount = async () => {
      if (!session) {
        setNotificationCount(0);
        return;
      }

      try {
        const { data } = await api.get("/notifications");
        if (isMounted && Array.isArray(data)) {
          const unread = data.filter(
            (n: { is_read: boolean }) => !n.is_read,
          ).length;
          setNotificationCount(unread);
        }
      } catch (err) {
        console.error("Failed to fetch notification count", err);
      }
    };

    updateNotificationCount();
    window.addEventListener("notificationsUpdated", updateNotificationCount);

    return () => {
      isMounted = false;
      window.removeEventListener(
        "notificationsUpdated",
        updateNotificationCount,
      );
    };
  }, [session]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".user-menu-container")) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    setUserMenuOpen(false);
    toast.info("Session terminated. Securely logged out.");
    navigate("/login");
  };

  const navLinks = [
    { name: "News", href: "/news" },
    { name: "Blog", href: "/blog" },
    { name: "Explore", href: "/explore" },
    { name: "Browse Resource", href: "/browse" },
    { name: "About Us", href: "/about" },
  ];

  const isHomePage = location.pathname === "/";
  const isAuthenticated = !!session;
  const role =
    user && typeof user.role === "object" && user.role !== null
      ? user.role.name
      : user?.role;
  const isAdmin =
    role === "Admin" || role === "admin" || role === "DepartmentHead";
  const isSuperAdmin = role === "SuperAdmin";
  const dashboardPath = isSuperAdmin
    ? "/super-admin"
    : isAdmin
      ? "/admin"
      : "/dashboard";
  const notificationsPath = isAdmin
    ? "/admin/notifications"
    : "/dashboard/notifications";
  const uploadPath = isAdmin ? "/admin/upload" : "/dashboard/upload";

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-[#DF8142]/20 selection:text-[#5A270F] dark:text-[#EEB38C] dark:selection:text-white transition-colors duration-500">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
          isScrolled
            ? "bg-white/80 dark:bg-[#1A0B04]/80 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border-b border-primary/50 py-3"
            : `${
                isHomePage
                  ? "bg-transparent py-6"
                  : "bg-white/90 dark:bg-[#1A0B04]/90 backdrop-blur-2xl py-4 border-b border-gray-100 dark:border-white/10/50 dark:border-white/5"
              }`
        }`}
      >
        <nav className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center shrink-0">
              <Link to="/" className="flex items-center gap-3 group">
                <div
                  className={`relative p-2.5 rounded-2xl transition-all duration-500 overflow-hidden ${
                    isScrolled || !isHomePage
                      ? "bg-[#DF8142] shadow-[0_12px_24px_-6px_rgba(223,129,66,0.5)]"
                      : "bg-white/10 dark:bg-card/10 backdrop-blur-md border border-white/30"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity bg-[length:200%_200%] animate-gradient-xy" />
                  <BookOpen
                    className={`h-6 w-6 text-white transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[12deg]`}
                  />
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-2xl font-black tracking-tighter leading-none transition-all duration-500 font-display ${
                      isScrolled || !isHomePage
                        ? "text-[#5A270F] dark:text-[#EEB38C] group-hover:text-[#DF8142]"
                        : "text-white group-hover:scale-105"
                    }`}
                  >
                    ARCH
                    <span className="text-[#DF8142] ml-0.5">VAULT</span>
                  </span>
                  <span
                    className={`text-[9px] font-black tracking-[0.3em] uppercase transition-all duration-500 ${
                      isScrolled || !isHomePage
                        ? "text-[#5A270F] dark:text-[#EEB38C]/60"
                        : "text-white/70"
                    }`}
                  >
                    Architectural Excellence
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    `relative px-5 py-2.5 rounded-full text-[13px] font-black uppercase tracking-widest transition-all duration-500 group/nav ${
                      isActive
                        ? isScrolled || !isHomePage
                          ? "text-[#DF8142]"
                          : "text-white"
                        : isScrolled || !isHomePage
                          ? "text-[#5A270F] dark:text-[#EEB38C]/80 hover:text-[#DF8142]"
                          : "text-white/70 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative z-10">{link.name}</span>
                      {isActive && (
                        <div
                          className={`absolute inset-0 rounded-full -z-0 transition-all duration-500 ${
                            isScrolled || !isHomePage
                              ? "bg-[#DF8142]/10 shadow-inner shadow-[#DF8142]/50"
                              : "bg-white/20 dark:bg-card/20 backdrop-blur-lg"
                          }`}
                        />
                      )}
                      {!isActive && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#DF8142]/90 rounded-full transition-all duration-300 group-hover/nav:w-4 opacity-0 group-hover/nav:opacity-100" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-3 lg:gap-4 ml-auto">
              {/* Upload Button (Authenticated Users) */}
              {isAuthenticated && !isSuperAdmin && (
                <Link
                  to={uploadPath}
                  className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 ${
                    isScrolled || !isHomePage
                      ? "bg-[#DF8142] text-white hover:bg-[#DF8142]/90 shadow-lg shadow-[#DF8142]/20"
                      : "bg-white dark:bg-card text-[#DF8142] hover:bg-gray-50 shadow-lg"
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  <span className="hidden xl:inline">Upload</span>
                </Link>
              )}

              {/* Notifications (Authenticated Users) */}
              {isAuthenticated && !isSuperAdmin && (
                <Link
                  to={notificationsPath}
                  className={`relative p-2.5 rounded-full transition-all hover:scale-110 ${
                    isScrolled || !isHomePage
                      ? "text-[#5A270F]/60 dark:text-white/50 hover:bg-gray-100 dark:bg-white/10"
                      : "text-white hover:bg-white/10 dark:bg-card/10"
                  }`}
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#DF8142] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse ring-4 ring-white shadow-lg">
                      {notificationCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Theme Toggle */}
              <ThemeToggle isScrolled={isScrolled} isHomePage={isHomePage} />

              {/* User Section */}
              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <div className="relative user-menu-container">
                      <button
                      onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                      className={`flex items-center gap-2 p-1.5 pr-2 sm:pr-3 rounded-full border transition-all ${
                        isScrolled || !isHomePage
                          ? "border-gray-200 hover:border-[#DF8142]/60 hover:bg-[#DF8142]/10"
                          : "border-white/20 hover:border-white/40 hover:bg-white/10 dark:bg-card/10"
                      }`}
                    >
                      <div className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden border-2 border-[#DF8142]/90">
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#DF8142]/90 to-[#92664A]">
                          <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                      </div>
                      <div className="hidden md:block text-left">
                        <p
                          className={`text-sm font-bold leading-none ${
                            isScrolled || !isHomePage
                              ? "text-slate-900 dark:text-white"
                              : "text-white"
                          }`}
                        >
                          {user?.first_name || user?.firstName || "User"}
                        </p>
                        <p
                          className={`text-xs ${
                            isScrolled || !isHomePage
                              ? "text-[#5A270F]/40 dark:text-white/60"
                              : "text-white/60"
                          }`}
                        >
                          {typeof user?.role === "object"
                            ? user.role.name
                            : user?.role || "Member"}
                        </p>
                      </div>
                      <ChevronDown
                        className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform ${
                          isUserMenuOpen ? "rotate-180" : ""
                        } ${
                          isScrolled || !isHomePage
                            ? "text-[#5A270F]/60"
                            : "text-white/60"
                        }`}
                      />
                    </button>

                     {/* User Dropdown Menu - Premium Architectural Style */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 sm:right-0 mt-4 w-64 sm:w-72 bg-white/95 dark:bg-[#1A0B04]/95 backdrop-blur-3xl rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-white dark:border-[#DF8142]/20 p-3 py-4 animate-in fade-in max-sm:translate-x-[15%] slide-in-from-top-4 duration-500 z-[100] ring-1 ring-[#5A270F]/5">
                        {/* Menu Header */}
                        <div className="px-5 py-6 mb-2 mx-2 rounded-[2rem] bg-[#5A270F] relative overflow-hidden group/header">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] transition-all group-hover/header:bg-primary/40" />
                          <div className="relative z-10">
                            <p className="text-xs font-black uppercase tracking-[0.25em] text-primary/80 mb-2">
                              System Access
                            </p>
                            <p className="text-lg font-black text-white leading-none tracking-tight">
                              {user?.first_name || user?.firstName}
                            </p>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">
                              {user?.email}
                            </p>
                          </div>
                        </div>

                        {/* Menu Links */}
                        <div className="space-y-1 p-1">
                          {/* Personal Console */}
                          {!isAdmin && !isSuperAdmin && (
                            <Link
                              to="/dashboard"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-4 px-5 py-4 text-sm font-bold text-[#5A270F] dark:text-[#EEB38C] bg-[#EFEDED] dark:bg-white/5 hover:bg-[#DF8142] hover:text-white dark:hover:bg-[#DF8142] dark:hover:text-white rounded-2xl transition-all group/item"
                            >
                              <div className="p-2 bg-white dark:bg-[#1A0B04] rounded-xl shadow-sm text-[#5A270F] dark:text-[#EEB38C] group-hover/item:bg-[#DF8142] group-hover/item:text-white dark:group-hover/item:bg-[#DF8142] dark:group-hover/item:text-white transition-all shadow-[#DF8142]/20">
                                <LayoutDashboard className="h-4 w-4" />
                              </div>
                              Personal Console
                            </Link>
                          )}

                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-4 px-5 py-4 text-sm font-bold text-[#DF8142] bg-[#DF8142]/10 hover:bg-[#DF8142] hover:text-white rounded-2xl transition-all group/item"
                            >
                              <div className="p-2 bg-white dark:bg-card dark:bg-[#2A1205] rounded-xl shadow-sm text-[#DF8142] group-hover/item:bg-[#DF8142]/90 group-hover/item:text-white transition-all">
                                <ShieldCheck className="h-4 w-4" />
                              </div>
                              Admin Command Center
                            </Link>
                          )}

                          {isSuperAdmin && (
                            <Link
                              to="/super-admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-4 px-5 py-4 text-sm font-bold text-[#5A270F] dark:text-[#EEB38C] bg-[#92664A]/10 hover:bg-[#5A270F] hover:text-white rounded-2xl transition-all group/item"
                            >
                              <div className="p-2 bg-white dark:bg-card dark:bg-[#2A1205] rounded-xl shadow-sm text-[#5A270F] dark:text-[#EEB38C] group-hover/item:bg-[#92664A] group-hover/item:text-white transition-all">
                                <ShieldAlert className="h-4 w-4" />
                              </div>
                              Super Architect Console
                            </Link>
                          )}
                        </div>

                        {/* Menu Footer */}
                        <div className="mt-2 pt-2 border-t border-slate-50 dark:border-white/5 px-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 w-full px-5 py-4 text-sm font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-2xl transition-all"
                          >
                            <LogOut className="h-4 w-4" />
                            Terminate Session
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      to="/login"
                      className={`group relative px-8 py-3 text-sm font-black uppercase tracking-widest rounded-full transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden shadow-xl ${
                        isScrolled || !isHomePage
                          ? "bg-[#5A270F] text-white shadow-[#5A270F]/20"
                          : "bg-white dark:bg-card text-[#5A270F] dark:text-[#EEB38C] shadow-white/10"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#DF8142] to-[#EEB38C] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="relative z-10 flex items-center gap-2">
                        Sign In
                        <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
               <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2.5 rounded-2xl transition-all shadow-md active:scale-95 ${
                  isScrolled || !isHomePage
                    ? "text-[#5A270F] bg-white border border-[#D9D9C2] dark:bg-white/5 dark:border-white/10"
                    : "text-white bg-white/10 backdrop-blur-md border border-white/20"
                }`}
                title={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 animate-in spin-in-90 duration-300" />
                ) : (
                  <Menu className="h-6 w-6 animate-in zoom-in duration-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Overlay Menu */}
           <div
            className={`lg:hidden fixed inset-x-4 top-[84px] max-h-[calc(100vh-120px)] overflow-y-auto bg-white/98 dark:bg-[#1A0B04]/98 backdrop-blur-3xl z-[200] rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] border border-white dark:border-[#DF8142]/20 transition-all duration-500 ease-in-out ${
              isMobileMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[-20px] pointer-events-none"
            }`}
          >
            <div className="p-4 sm:p-6 space-y-6">
              {/* Premium Header for Mobile Dropdown */}
              <div className="bg-gradient-to-r from-[#5A270F] to-[#6C3B1C] p-6 rounded-[2rem] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#DF8142]/20 blur-3xl" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EEB38C] mb-1">
                      Main Matrix
                    </h4>
                    <p className="text-xl font-black uppercase tracking-tighter">
                      Navigation
                    </p>
                  </div>
                  <Sparkles className="h-6 w-6 text-[#EEB38C] animate-pulse" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-6 py-4 rounded-2xl text-lg font-black tracking-tight transition-all flex items-center justify-between ${
                        isActive
                          ? "text-[#DF8142] bg-[#DF8142]/5 border border-[#DF8142]/20"
                          : "text-[#5A270F] dark:text-[#EEB38C] hover:bg-gray-50 dark:hover:bg-white/5"
                      }`
                    }
                  >
                    {link.name}
                    <ArrowRight className="h-4 w-4 opacity-30" />
                  </NavLink>
                ))}

                {isAuthenticated && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 space-y-2">
                    <p className="px-6 text-[9px] font-black text-[#5A270F]/40 dark:text-white/30 uppercase tracking-[0.4em] mb-4">
                      User Intelligence
                    </p>
                    <Link
                      to={dashboardPath}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-6 py-4 rounded-2xl text-lg font-black tracking-tight text-[#5A270F] dark:text-white flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                    >
                      <LayoutDashboard className="h-6 w-6 text-[#DF8142]" />
                      Dashboard
                    </Link>
                    <Link
                      to={uploadPath}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-6 py-4 rounded-2xl text-lg font-black tracking-tight text-[#5A270F] dark:text-white flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                    >
                      <Upload className="h-6 w-6 text-[#DF8142]" />
                      Upload Node
                    </Link>
                  </div>
                )}
              </div>

              <div className="pt-4">
                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-3 w-full py-5 font-black text-white bg-[#5A270F] rounded-2.5xl shadow-2xl shadow-[#5A270F]/20 uppercase tracking-[0.2em] text-xs"
                  >
                    <User className="h-4 w-4" />
                    Enter Archive
                  </Link>
                ) : (
                   <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-3 w-full py-5 font-black text-red-500 bg-red-50 dark:bg-red-500/10 rounded-2.5xl uppercase tracking-[0.2em] text-xs"
                  >
                    <LogOut className="h-4 w-4" />
                    Terminate Session
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className={`flex-grow ${isHomePage ? "pt-0" : "pt-24"}`}>
        <Outlet />
      </main>

      <Footer />
      <Toaster richColors position="bottom-right" expand={false} />
    </div>
  );
};

export default Layout;
