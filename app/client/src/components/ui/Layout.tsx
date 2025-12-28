import { useState, useEffect } from "react";
import {
  Outlet,
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Menu, X, BookOpen, User, LogOut, ShieldCheck } from "lucide-react";
import { isAuthenticated, clearToken, getUser } from "../../lib/auth";
import Footer from "./Footer";

const Layout = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinks = [
    { name: "Browse", href: "/browse" },
    { name: "Insights", href: "/blog" },
    { name: "About", href: "/about" },
  ];

  const isHomePage = location.pathname === "/";

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
                    ARC
                    <span className="text-indigo-500 underline decoration-2 underline-offset-4">
                      HIVE
                    </span>
                  </span>
                  <span
                    className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors opacity-60 ${
                      isScrolled || !isHomePage
                        ? "text-gray-500"
                        : "text-white/80"
                    }`}
                  >
                    Infrastructure
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
            <div className="flex items-center gap-3 lg:gap-6 ml-auto">
              {/* Search Bar Placeholder (Premium touch) */}
              <div className="hidden md:flex items-center relative group">
                <div
                  className={`absolute left-3 transition-colors duration-300 ${
                    isScrolled || !isHomePage
                      ? "text-gray-400 group-focus-within:text-indigo-500"
                      : "text-white/40 group-focus-within:text-white"
                  }`}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search architecture..."
                  className={`pl-10 pr-4 py-2 rounded-full text-sm font-medium transition-all duration-500 outline-none w-48 lg:w-64 border ${
                    isScrolled || !isHomePage
                      ? "bg-gray-50 border-gray-100 focus:bg-white focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-200"
                      : "bg-white/10 border-white/10 text-white placeholder-white/40 focus:bg-white/20 focus:border-white/30"
                  }`}
                />
              </div>

              {/* User Section */}
              <div className="flex items-center gap-2">
                {isAuthenticated() ? (
                  <div className="flex items-center gap-1.5 p-1 rounded-full border border-gray-100/50 transition-all">
                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        className={`p-2 rounded-full transition-all hover:bg-indigo-50 group shrink-0 ${
                          isScrolled || !isHomePage
                            ? "text-gray-500"
                            : "text-white/80"
                        }`}
                      >
                        <ShieldCheck className="h-5 w-5 group-hover:text-indigo-600" />
                      </Link>
                    )}
                    <Link
                      to="/dashboard"
                      className={`relative group shrink-0 h-10 w-10 rounded-full overflow-hidden border-2 transition-all ${
                        isScrolled || !isHomePage
                          ? "border-indigo-50 group-hover:border-indigo-200"
                          : "border-white/20 group-hover:border-white/50"
                      }`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`hidden sm:flex p-2.5 rounded-full transition-all hover:bg-red-50 group shrink-0 ${
                        isScrolled || !isHomePage
                          ? "text-gray-400"
                          : "text-white/60"
                      }`}
                    >
                      <LogOut className="h-4.5 w-4.5 group-hover:text-red-500" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      to="/login"
                      className={`text-sm font-bold tracking-tight transition-colors ${
                        isScrolled || !isHomePage
                          ? "text-gray-600 hover:text-indigo-600"
                          : "text-white hover:text-indigo-200"
                      }`}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className={`px-5 py-2.5 text-sm font-black tracking-tight rounded-full shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] ${
                        isScrolled || !isHomePage
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-white text-indigo-600 hover:bg-gray-50"
                      }`}
                    >
                      Join Now
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
              </div>

              <div className="pt-8 border-t border-gray-100">
                {!isAuthenticated() && (
                  <div className="grid grid-cols-1 gap-4">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-5 text-center font-bold text-gray-600 bg-gray-50 rounded-2xl"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-5 text-center font-black text-white bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow pt-0">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
