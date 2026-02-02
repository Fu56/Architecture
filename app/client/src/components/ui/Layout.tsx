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
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { useSession, authClient } from "../../lib/auth-client";
import { api } from "../../lib/api";
import { syncSessionToStorage } from "../../lib/auth";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary/20 selection:text-[#2A1205]">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
          isScrolled
            ? "bg-white/80 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border-b border-primary/50 py-3"
            : `${
                isHomePage
                  ? "bg-transparent py-6"
                  : "bg-white/90 backdrop-blur-2xl py-4 border-b border-gray-100/50"
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
                      : "bg-white/10 backdrop-blur-md border border-white/30"
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
                        ? "text-[#5A270F] group-hover:text-[#DF8142]"
                        : "text-white group-hover:scale-105"
                    }`}
                  >
                    ARCH
                    <span className="text-[#DF8142] ml-0.5">VAULT</span>
                  </span>
                  <span
                    className={`text-[9px] font-black tracking-[0.3em] uppercase transition-all duration-500 ${
                      isScrolled || !isHomePage
                        ? "text-gray-500"
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
                          ? "text-[#5A270F]/80 hover:text-[#DF8142]"
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
                              : "bg-white/20 backdrop-blur-lg"
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
                  to="/dashboard/upload"
                  className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 ${
                    isScrolled || !isHomePage
                      ? "bg-[#DF8142] text-white hover:bg-[#DF8142]/90 shadow-lg shadow-[#DF8142]/20"
                      : "bg-white text-[#DF8142] hover:bg-gray-50 shadow-lg"
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
                      ? "text-gray-600 hover:bg-gray-100"
                      : "text-white hover:bg-white/10"
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

              {/* User Section */}
              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <div className="relative user-menu-container">
                    <button
                      onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                      className={`flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all ${
                        isScrolled || !isHomePage
                          ? "border-gray-200 hover:border-[#DF8142]/60 hover:bg-[#DF8142]/10"
                          : "border-white/20 hover:border-white/40 hover:bg-white/10"
                      }`}
                    >
                      <div className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-[#DF8142]/90">
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#DF8142]/90 to-[#92664A]">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="hidden md:block text-left">
                        <p
                          className={`text-sm font-bold leading-none ${
                            isScrolled || !isHomePage
                              ? "text-gray-900"
                              : "text-white"
                          }`}
                        >
                          {user?.first_name || user?.firstName || "User"}
                        </p>
                        <p
                          className={`text-xs ${
                            isScrolled || !isHomePage
                              ? "text-gray-500"
                              : "text-white/60"
                          }`}
                        >
                          {typeof user?.role === "object"
                            ? user.role.name
                            : user?.role || "Member"}
                        </p>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          isUserMenuOpen ? "rotate-180" : ""
                        } ${
                          isScrolled || !isHomePage
                            ? "text-gray-400"
                            : "text-white/60"
                        }`}
                      />
                    </button>

                    {/* User Dropdown Menu - Premium Architectural Style */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-4 w-72 bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-white p-3 py-4 animate-in fade-in slide-in-from-top-4 duration-500 z-[100] ring-1 ring-[#5A270F]/5">
                        {/* Menu Header */}
                        <div className="px-5 py-6 mb-2 mx-2 rounded-[2rem] bg-[#2A1205] relative overflow-hidden group/header">
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
                          {/* <Link
                            to={dashboardPath}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-4 px-5 py-4 text-sm font-bold text-[#5A270F]/80 hover:text-primary hover:bg-[#EFEDED] rounded-2xl transition-all group/item"
                          >
                            <div className="p-2 bg-[#EFEDED] rounded-xl group-hover/item:bg-primary group-hover/item:text-white transition-all">
                              <LayoutDashboard className="h-4 w-4" />
                            </div>
                            Personal Console
                          </Link> */}

                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-4 px-5 py-4 text-sm font-bold text-primary bg-primary/50 hover:bg-primary hover:text-white rounded-2xl transition-all group/item"
                            >
                              <div className="p-2 bg-white rounded-xl shadow-sm text-primary group-hover/item:bg-primary/90 group-hover/item:text-white transition-all">
                                <ShieldCheck className="h-4 w-4" />
                              </div>
                              Admin Command Center
                            </Link>
                          )}

                          {isSuperAdmin && (
                            <Link
                              to="/super-admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-4 px-5 py-4 text-sm font-bold text-[#5A270F] bg-[#92664A]/5/50 hover:bg-[#5A270F] hover:text-white rounded-2xl transition-all group/item"
                            >
                              <div className="p-2 bg-white rounded-xl shadow-sm text-[#5A270F] group-hover/item:bg-[#92664A] group-hover/item:text-white transition-all">
                                <ShieldAlert className="h-4 w-4" />
                              </div>
                              Super Architect Console
                            </Link>
                          )}

                          {/* <Link
                            to="/dashboard/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-4 px-5 py-4 text-sm font-bold text-[#5A270F]/80 hover:text-primary hover:bg-[#EFEDED] rounded-2xl transition-all group/item"
                          >
                            <div className="p-2 bg-[#EFEDED] rounded-xl group-hover/item:bg-primary group-hover/item:text-white transition-all">
                              <User className="h-4 w-4" />
                            </div>
                            System Settings
                          </Link> */}
                        </div>

                        {/* Menu Footer */}
                        <div className="mt-2 pt-2 border-t border-slate-50 px-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 w-full px-5 py-4 text-sm font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-2xl transition-all"
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
                      className={`px-6 py-2.5 text-sm font-black tracking-tight rounded-full shadow-lg transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] ${
                        isScrolled || !isHomePage
                          ? "bg-primary text-white shadow-primary/20 hover:bg-primary/90"
                          : "bg-white text-primary hover:bg-gray-50 shadow-white/20"
                      }`}
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2.5 rounded-2xl transition-all ${
                  isScrolled || !isHomePage
                    ? "text-gray-600 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Overlay Menu */}
          <div
            className={`lg:hidden fixed inset-0 top-[72px] bg-white/95 backdrop-blur-2xl z-[45] transition-all duration-500 ease-in-out ${
              isMobileMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-[-10px] pointer-events-none"
            }`}
          >
            <div className="container mx-auto px-6 py-12 space-y-8">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/90 px-4">
                  Navigation
                </span>
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-4 rounded-2xl text-2xl font-black tracking-tight transition-all ${
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-gray-900"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}

                {isAuthenticated && !isSuperAdmin && (
                  <>
                    <Link
                      to="/dashboard/upload"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-4 rounded-2xl text-2xl font-black tracking-tight text-gray-900 flex items-center gap-3"
                    >
                      <Upload className="h-6 w-6" />
                      Upload
                    </Link>
                    <Link
                      to={dashboardPath}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-4 rounded-2xl text-2xl font-black tracking-tight text-gray-900 flex items-center gap-3"
                    >
                      <LayoutDashboard className="h-6 w-6" />
                      Dashboard
                    </Link>
                  </>
                )}
              </div>

              <div className="pt-8 border-t border-gray-100">
                {!isAuthenticated && (
                  <div className="grid grid-cols-1">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-5 text-center font-black text-white bg-primary rounded-2xl shadow-xl shadow-primary/20"
                    >
                      Sign In
                    </Link>
                  </div>
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
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Layout;
