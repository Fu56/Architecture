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
    { name: "Home", href: "/" },
    { name: "Browse", href: "/browse" },
    { name: "Insights", href: "/blog" },
    { name: "About", href: "/about" },
  ];

  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl shadow-[0_2px_20px_rgb(0,0,0,0.05)] py-3"
            : `${
                isHomePage
                  ? "bg-transparent py-5"
                  : "bg-white/80 backdrop-blur-xl py-4"
              }`
        }`}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div
                  className={`p-1.5 rounded-xl transition-all duration-500 ${
                    isScrolled || !isHomePage
                      ? "bg-indigo-600 shadow-lg shadow-indigo-100 rotate-0 group-hover:rotate-12"
                      : "bg-white/10 backdrop-blur rotate-0 group-hover:rotate-12"
                  }`}
                >
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span
                  className={`text-xl font-bold tracking-tight transition-colors font-display ${
                    isScrolled || !isHomePage ? "text-gray-900" : "text-white"
                  }`}
                >
                  Digital<span className="text-indigo-500">Library</span>
                </span>
              </Link>
            </div>

            <div className="hidden md:flex md:items-center md:space-x-10">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    `${
                      isScrolled || !isHomePage
                        ? "nav-link"
                        : "nav-link nav-link-light"
                    } ${isActive ? "nav-active" : ""}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                {isAuthenticated() ? (
                  <div className="flex items-center gap-3 pl-6 border-l border-gray-200/20">
                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        title="Admin Panel"
                        className={`p-2.5 rounded-xl transition-all hover:bg-indigo-50 group ${
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
                      title="User Dashboard"
                      className={`p-2.5 rounded-xl transition-all hover:bg-indigo-50 group ${
                        isScrolled || !isHomePage
                          ? "text-gray-500"
                          : "text-white/80"
                      }`}
                    >
                      <User className="h-5 w-5 group-hover:text-indigo-600" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      title="Sign Out"
                      className={`p-2.5 rounded-xl transition-all hover:bg-red-50 group ${
                        isScrolled || !isHomePage
                          ? "text-gray-500"
                          : "text-white/80"
                      }`}
                    >
                      <LogOut className="h-5 w-5 group-hover:text-red-500" />
                    </button>
                    {user && (
                      <div
                        className={`flex flex-col ml-1 ${
                          isScrolled || !isHomePage
                            ? "text-gray-900"
                            : "text-white"
                        }`}
                      >
                        <span className="text-xs font-bold leading-none">
                          {user.firstName}
                        </span>
                        <span className="text-[10px] opacity-60 leading-tight uppercase font-bold tracking-tighter">
                          {user.role}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={`text-[15px] font-semibold transition-colors ${
                        isScrolled || !isHomePage
                          ? "text-gray-600 hover:text-indigo-600"
                          : "text-white hover:text-indigo-200"
                      }`}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className={`ml-4 px-6 py-2.5 text-sm font-bold rounded-xl shadow-lg transition-all active:scale-95 ${
                        isScrolled || !isHomePage
                          ? "bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200"
                          : "bg-white text-indigo-600 hover:bg-gray-100"
                      }`}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>

              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                  className={`p-2 rounded-xl transition-colors ${
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
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="bg-white/90 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl border border-gray-100">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-100">
                  {isAuthenticated() ? (
                    <div className="grid grid-cols-3 gap-2">
                      {user?.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-indigo-50 text-gray-500"
                        >
                          <ShieldCheck className="h-6 w-6" />
                          <span className="text-[10px] font-bold uppercase tracking-tight">
                            Admin
                          </span>
                        </Link>
                      )}
                      <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-indigo-50 text-gray-500"
                      >
                        <User className="h-6 w-6" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">
                          Profile
                        </span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-red-50 text-gray-500"
                      >
                        <LogOut className="h-6 w-6" />
                        <span className="text-[10px] font-bold uppercase tracking-tight">
                          Logout
                        </span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full px-4 py-3 text-center font-bold text-gray-600 bg-gray-100 rounded-xl"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full px-4 py-3 text-center font-bold text-white bg-indigo-600 rounded-xl"
                      >
                        Get Started
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
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
