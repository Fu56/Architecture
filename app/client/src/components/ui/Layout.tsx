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
  Upload,
  Bell,
  Settings,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import {
  isAuthenticated,
  clearToken,
  getUser,
  currentRole,
} from "../../lib/auth";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const notificationCount = 3; // TODO: Fetch from API and convert to state
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

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

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem("user");
    setUserMenuOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Browse Resource", href: "/browse" },
    { name: "Explore", href: "/explore" },
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "News", href: "/news" },
  ];

  const isHomePage = location.pathname === "/";
  const role = currentRole();
  const isAdmin = role === "Admin" || role === "SuperAdmin" || role === "admin";
  const dashboardPath = isAdmin ? "/admin" : "/dashboard";

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
          isScrolled
            ? "bg-white/80 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-gray-100/50 py-3"
            : `${
                isHomePage
                  ? "bg-transparent py-6"
                  : "bg-white/80 backdrop-blur-2xl py-4 border-b border-gray-100/50"
              }`
        }`}
      >
        <nav className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center shrink-0">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div
                  className={`relative p-2 rounded-2xl transition-all duration-500 overflow-hidden ${
                    isScrolled || !isHomePage
                      ? "bg-indigo-600 shadow-[0_8px_20px_-4px_rgba(79,70,229,0.4)]"
                      : "bg-white/10 backdrop-blur-md border border-white/20"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <BookOpen
                    className={`h-6 w-6 text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
                  />
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-xl font-black tracking-tighter leading-none transition-colors font-display ${
                      isScrolled || !isHomePage ? "text-gray-900" : "text-white"
                    }`}
                  >
                    ARCH
                    <span className="text-indigo-500 ml-1">VAULT</span>
                  </span>
                  <span
                    className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors opacity-60 ${
                      isScrolled || !isHomePage
                        ? "text-gray-500"
                        : "text-white/80"
                    }`}
                  >
                    Digital Library
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    `px-5 py-2.5 rounded-full text-[14px] font-bold tracking-tight transition-all duration-300 ${
                      isActive
                        ? isScrolled || !isHomePage
                          ? "bg-indigo-50 text-indigo-600"
                          : "bg-white/20 text-white backdrop-blur-md"
                        : isScrolled || !isHomePage
                        ? "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-3 lg:gap-4 ml-auto">
              {/* Upload Button (Authenticated Users) */}
              {isAuthenticated() && (
                <Link
                  to="/dashboard/upload"
                  className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 ${
                    isScrolled || !isHomePage
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/30"
                      : "bg-white text-indigo-600 hover:bg-gray-50 shadow-lg"
                  }`}
                >
                  <Upload className="h-4 w-4" />
                  <span className="hidden xl:inline">Upload</span>
                </Link>
              )}

              {/* Notifications (Authenticated Users) */}
              {isAuthenticated() && (
                <Link
                  to="/dashboard/notifications"
                  className={`relative p-2.5 rounded-full transition-all hover:scale-110 ${
                    isScrolled || !isHomePage
                      ? "text-gray-600 hover:bg-gray-100"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {notificationCount}
                    </span>
                  )}
                </Link>
              )}

              {/* User Section */}
              <div className="flex items-center gap-2">
                {isAuthenticated() ? (
                  <div className="relative user-menu-container">
                    <button
                      onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                      className={`flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all ${
                        isScrolled || !isHomePage
                          ? "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                          : "border-white/20 hover:border-white/40 hover:bg-white/10"
                      }`}
                    >
                      <div className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-indigo-500">
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
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
                      <div className="absolute right-0 mt-4 w-72 bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] border border-white p-3 py-4 animate-in fade-in slide-in-from-top-4 duration-500 z-[100] ring-1 ring-slate-900/5">
                        {/* Menu Header */}
                        <div className="px-5 py-6 mb-2 mx-2 rounded-[2rem] bg-slate-950 relative overflow-hidden group/header">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[50px] transition-all group-hover/header:bg-indigo-600/40" />
                          <div className="relative z-10">
                            <p className="text-xs font-black uppercase tracking-[0.25em] text-indigo-400 mb-2">
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
                          <Link
                            to={dashboardPath}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-4 px-5 py-4 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-2xl transition-all group/item"
                          >
                            <div className="p-2 bg-slate-50 rounded-xl group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all">
                              <LayoutDashboard className="h-4 w-4" />
                            </div>
                            Personal Console
                          </Link>

                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-4 px-5 py-4 text-sm font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all group/item"
                            >
                              <div className="p-2 bg-white rounded-xl shadow-sm text-indigo-600 group-hover/item:bg-indigo-500 group-hover/item:text-white transition-all">
                                <ShieldCheck className="h-4 w-4" />
                              </div>
                              Admin Command Center
                            </Link>
                          )}

                          <Link
                            to="/dashboard/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-4 px-5 py-4 text-sm font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-2xl transition-all group/item"
                          >
                            <div className="p-2 bg-slate-50 rounded-xl group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all">
                              <Settings className="h-4 w-4" />
                            </div>
                            System Settings
                          </Link>
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
                          ? "bg-indigo-600 text-white shadow-indigo-600/30 hover:bg-indigo-700"
                          : "bg-white text-indigo-600 hover:bg-gray-50 shadow-white/20"
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
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 px-4">
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
                          ? "text-indigo-600 bg-indigo-50"
                          : "text-gray-900"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}

                {isAuthenticated() && (
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
                {!isAuthenticated() && (
                  <div className="grid grid-cols-1">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-5 text-center font-black text-white bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20"
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
