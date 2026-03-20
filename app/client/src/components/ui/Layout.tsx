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
  ChevronDown,
  LayoutDashboard,
  Moon,
  Sun,
} from "lucide-react";
import { useSession, authClient } from "../../lib/auth-client";
import { useTheme } from "../../context/useTheme";
import { api } from "../../lib/api";
import { syncSessionToStorage } from "../../lib/auth";
import Footer from "./Footer";
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
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const { data: session } = useSession();
  const user = session?.user as UserWithRole | undefined;

  useEffect(() => {
    syncSessionToStorage();
  }, [session]);

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
          const unread = data.filter((n: { is_read: boolean }) => !n.is_read).length;
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
      window.removeEventListener("notificationsUpdated", updateNotificationCount);
    };
  }, [session]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".user-menu-container")) setUserMenuOpen(false);
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

  const navLinksList = [
    { name: "News", href: "/news" },
    { name: "Blog", href: "/blog" },
    { name: "Explore", href: "/explore" },
    { name: "Browse Resource", href: "/browse" },
    { name: "About Us", href: "/about" },
    ...(session ? [{ name: "Nexus", href: "/dashboard/nexus" }] : []),
  ];

  const isHomePage = location.pathname === "/";
  const isAuthenticated = !!session;
  const role = user && typeof user.role === "object" && user.role !== null ? user.role.name : user?.role;
  const isAdmin = role === "Admin" || role === "admin" || role === "DepartmentHead";
  const isSuperAdmin = role === "SuperAdmin";
  const uploadPath = isAdmin ? "/admin/upload" : "/dashboard/upload";
  const notificationsPath = isAdmin ? "/admin/notifications" : "/dashboard/notifications";

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-[#DF8142]/20 selection:text-[#5A270F] text-[#5A270F] dark:text-[#EEB38C] dark:selection:text-white transition-colors duration-500 ${isLight ? 'bg-white' : 'bg-[#0E0704]'}`}>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
          isScrolled
            ? "bg-white/95 dark:bg-[#1A0B04]/90 backdrop-blur-3xl shadow-[0_8px_32px_rgba(90,39,15,0.08)] py-2 border-b border-[#DF8142]/20"
            : isHomePage
            ? isLight 
              ? "bg-white/80 backdrop-blur-2xl py-4 border-b border-[#D9D9C2]/50" 
              : "bg-transparent py-4"
            : "bg-white/95 dark:bg-[#1A0B04]/95 backdrop-blur-2xl py-3 border-b border-[#D9D9C2]/30 dark:border-white/5"
        }`}
      >
        <nav className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo Section */}
            <div className="flex items-center shrink-0">
              <Link to="/" className="flex items-center gap-3 group">
                <div
                  className={`relative p-2 rounded-xl transition-all duration-700 overflow-hidden ${
                    isScrolled || !isHomePage
                      ? "bg-[#DF8142] shadow-lg"
                      : isLight ? "bg-[#5A270F] shadow-lg scale-105" : "bg-[#1A0B04]/40 backdrop-blur-xl border border-white/20 shadow-2xl"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity bg-[length:200%_200%] animate-gradient-xy" />
                  <BookOpen className="h-5 w-5 text-white transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[12deg]" />
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-lg font-black tracking-tighter leading-none transition-all duration-500 font-display ${
                      isScrolled || !isHomePage ? "text-[#5A270F] dark:text-[#EEB38C]" : isLight ? "text-[#5A270F]" : "text-white"
                    }`}
                  >
                    ARCH<span className="text-[#DF8142] ml-0.5">VAULT</span>
                  </span>
                  <span
                    className={`text-[9.5px] font-black tracking-[0.2em] uppercase transition-all duration-500 ${
                      isScrolled || !isHomePage ? "text-[#5A270F]/60 dark:text-[#EEB38C]/60" : isLight ? "text-[#5A270F]/50" : "text-white/70"
                    }`}
                  >
                    Wollo University KIOT Campus
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Cluster */}
            <div className="hidden lg:flex items-center gap-10 flex-grow justify-end">
              {/* Navigation */}
              <div className="flex items-center space-x-1">
                {navLinksList.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    className={({ isActive }) =>
                      `relative px-3 py-1.5 rounded-full text-[10.5px] font-black uppercase tracking-widest transition-all duration-500 group/nav ${
                        isActive
                          ? "text-[#DF8142]"
                          : isScrolled || !isHomePage ? "text-[#5A270F] dark:text-[#EEB38C]/80 hover:text-[#DF8142]" : isLight ? "text-[#5A270F]/70 hover:text-[#DF8142]" : "text-white/70 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }: { isActive: boolean }) => (
                      <>
                        <span className="relative z-10">{link.name}</span>
                        {isActive && (
                          <div
                            className={`absolute inset-0 rounded-full -z-0 transition-all duration-500 ${
                              isScrolled || !isHomePage ? "bg-[#DF8142]/10 shadow-inner shadow-[#DF8142]/50" : "bg-white/20 dark:bg-card/20 backdrop-blur-lg"
                            }`}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 lg:gap-4">
                {isAuthenticated && !isSuperAdmin && (
                  <Link
                    to={uploadPath}
                    className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold transition-all duration-300 hover:scale-105 ${
                      isScrolled || !isHomePage ? "bg-[#DF8142] text-white hover:bg-[#DF8142]/90 shadow-lg" : "bg-white dark:bg-card text-[#DF8142] hover:bg-gray-50 shadow-lg"
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span className="uppercase tracking-widest text-[9px] font-black">Upload</span>
                  </Link>
                )}

                {isAuthenticated && !isSuperAdmin && (
                  <Link
                    to={notificationsPath}
                    className={`relative p-2 rounded-full transition-all hover:scale-110 ${
                      isScrolled || !isHomePage ? "text-[#5A270F]/60 dark:text-white/50 hover:bg-gray-100 dark:bg-white/10" : isLight ? "text-[#5A270F]/40 hover:bg-[#5A270F]/5" : "text-white hover:bg-white/10 dark:bg-card/10"
                    }`}
                  >
                    <Bell className="h-4.5 w-4.5" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#DF8142] text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-pulse ring-2 ring-white shadow-lg">
                        {notificationCount}
                      </span>
                    )}
                  </Link>
                )}

                <button
                  onClick={toggleTheme}
                  title="Switch Theme"
                  className={`p-2 rounded-full transition-all hover:scale-110 ${
                    isScrolled || !isHomePage ? "text-[#5A270F]/60 dark:text-white/50 hover:bg-gray-100 dark:bg-white/10" : isLight ? "text-[#5A270F]/40 hover:bg-[#5A270F]/5" : "text-white hover:bg-white/10 dark:bg-card/10"
                  }`}
                >
                  {isLight ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
                </button>

                {isAuthenticated ? (
                  <div className="relative user-menu-container">
                    <button
                      onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                      className={`flex items-center gap-1.5 p-1 pr-2 rounded-full border transition-all ${
                        isScrolled || !isHomePage ? "border-gray-200 hover:border-[#DF8142]/60 hover:bg-[#DF8142]/10" : isLight ? "border-[#5A270F]/10 hover:border-[#5A270F]/30 hover:bg-[#5A270F]/5" : "border-white/20 hover:border-white/40 hover:bg-white/10 dark:bg-card/10"
                      }`}
                    >
                      <div className="relative h-7 w-7 rounded-full overflow-hidden border-2 border-[#DF8142]/90">
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#DF8142]/90 to-[#92664A]">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="hidden md:block text-left">
                        <p className={`text-[11px] font-bold leading-none ${isScrolled || !isHomePage ? "text-slate-900 dark:text-white" : isLight ? "text-[#5A270F]" : "text-white"}`}>
                          {user?.first_name || user?.firstName || "User"}
                        </p>
                        <p className={`text-[9px] ${isScrolled || !isHomePage ? "text-[#5A270F]/40 dark:text-white/60" : isLight ? "text-[#5A270F]/40" : "text-white/60"}`}>
                          {typeof user?.role === "object" ? user.role.name : user?.role || "Member"}
                        </p>
                      </div>
                      <ChevronDown className={`h-3 w-3 transition-transform ${isUserMenuOpen ? "rotate-180" : ""} ${isScrolled || !isHomePage ? "text-[#5A270F]/60" : isLight ? "text-[#5A270F]/60" : "text-white/60"}`} />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-4 w-60 bg-white/95 dark:bg-[#1A0B04]/95 backdrop-blur-3xl rounded-[1.5rem] shadow-2xl border border-white dark:border-[#DF8142]/20 p-2 py-3 z-[100]">
                        <div className="px-4 py-4 mb-2 mx-1 rounded-[1.2rem] bg-[#5A270F] relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-[40px]" />
                          <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-1">Access Tier</p>
                            <p className="text-sm font-black text-white leading-none">{user?.first_name || user?.firstName}</p>
                            <p className="text-[9px] font-bold text-white/40 truncate mt-1">{user?.email}</p>
                          </div>
                        </div>
                        <div className="space-y-0.5 p-1">
                          {isAdmin ? (
                            <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-[#DF8142] bg-[#DF8142]/10 hover:bg-[#DF8142] hover:text-white rounded-xl transition-all">
                              <ShieldCheck className="h-4 w-4" /> Admin Console
                            </Link>
                          ) : isSuperAdmin ? (
                            <Link to="/super-admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-[#5A270F] dark:text-[#EEB38C] bg-[#92664A]/10 hover:bg-[#5A270F] hover:text-white rounded-xl transition-all">
                              <ShieldAlert className="h-4 w-4" /> Super Architect
                            </Link>
                          ) : (
                            <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-[#5A270F] dark:text-[#EEB38C] bg-[#EFEDED] dark:bg-white/5 hover:bg-[#DF8142] hover:text-white rounded-xl transition-all">
                              <LayoutDashboard className="h-4 w-4" /> Personal Console
                            </Link>
                          )}
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-50 dark:border-white/5">
                          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
                            <LogOut className="h-3.5 w-3.5" /> Terminate
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/login" className={`group relative px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all duration-500 hover:scale-105 active:scale-95 shadow-xl ${isScrolled || !isHomePage ? "bg-[#5A270F] text-white" : isLight ? "bg-[#5A270F] text-white" : "bg-white text-[#5A270F]"}`}>
                    Sign In
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Interactivity */}
            <div className="flex lg:hidden items-center gap-2 ml-auto">
              <button
                onClick={toggleTheme}
                title="Switch Theme"
                className={`p-2.5 rounded-2xl transition-all shadow-lg active:scale-95 ${isScrolled || !isHomePage ? (isLight ? "text-[#5A270F] bg-white border border-[#D9D9C2]" : "text-[#EEB38C] bg-white/10") : isLight ? "text-[#5A270F] bg-white border border-[#D9D9C2]" : "text-white bg-white/10 backdrop-blur-md border border-white/20"}`}
              >
                {isLight ? <Moon className="h-5.5 w-5.5" /> : <Sun className="h-5.5 w-5.5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2.5 rounded-2xl transition-all shadow-lg active:scale-95 ${isScrolled || !isHomePage ? "text-[#5A270F] bg-white border border-[#D9D9C2]" : isLight ? "text-[#5A270F] bg-white border border-[#D9D9C2]" : "text-white bg-white/10 backdrop-blur-md border border-white/20"}`}
              >
                {isMobileMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute inset-x-4 top-[70px] bg-white/98 dark:bg-[#1A0B04]/98 backdrop-blur-3xl rounded-[2rem] shadow-2xl border border-white dark:border-[#DF8142]/20 p-4 z-[200] animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="space-y-2">
              {navLinksList.map((link) => (
                <Link key={link.name} to={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-6 py-4 rounded-xl text-lg font-black tracking-tight text-[#5A270F] dark:text-[#EEB38C] hover:bg-[#DF8142]/5 transition-all">
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/10">
                {!isAuthenticated ? (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-3 w-full py-4 font-black text-white bg-[#5A270F] rounded-xl uppercase tracking-widest text-[10px]">
                    Enter Archive
                  </Link>
                ) : (
                  <button onClick={handleLogout} className="flex items-center justify-center gap-3 w-full py-4 font-black text-red-500 bg-red-50 rounded-xl uppercase tracking-widest text-[10px]">
                    Terminate
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <main className={`flex-grow ${isHomePage ? "pt-0" : "pt-20"}`}>
        <Outlet />
      </main>

      <Footer />
      <Toaster richColors position="bottom-right" expand={false} />
    </div>
  );
};

export default Layout;
