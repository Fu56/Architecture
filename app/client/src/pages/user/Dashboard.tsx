import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Upload,
  Bell,
  User,
  LayoutDashboard,
  Library,
  UploadCloud,
  BookOpen,
  PenTool,
  Shield,
  Activity,
  Terminal,
} from "lucide-react";
import { getUser } from "../../lib/auth";

const dashboardNavLinks = [
  { name: "Terminal", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { name: "Deploy New", href: "/dashboard/upload", icon: UploadCloud },
  { name: "Asset Library", href: "/dashboard/resources", icon: Library },
  { name: "Assessments", href: "/dashboard/assignments", icon: BookOpen },
  { name: "My Archives", href: "/dashboard/uploads", icon: Upload },
  {
    name: "Journal Entry",
    href: "/dashboard/blog/new",
    icon: PenTool,
    role: "Faculty",
  },
  { name: "Signals", href: "/dashboard/notifications", icon: Bell },
  { name: "Identity", href: "/dashboard/profile", icon: User },
];

const UserDashboard = () => {
  const location = useLocation();
  const user = getUser();
  const currentLink = [...dashboardNavLinks]
    .reverse()
    .find((l) =>
      l.exact
        ? location.pathname === l.href
        : location.pathname.startsWith(l.href)
    );

  const getTitle = () => {
    return currentLink?.name || "Member Dashboard";
  };

  const userRole =
    typeof user?.role === "object" ? user.role.name : user?.role || "Member";

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Immersive User Sidebar */}
          <aside className="w-full lg:w-[320px] lg:sticky lg:top-24 z-30">
            <div className="bg-slate-950 rounded-[3rem] p-8 shadow-3xl relative overflow-hidden ring-1 ring-white/10 flex flex-col min-h-[85vh]">
              {/* Abstract Background pattern */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/20 blur-[80px] -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Profile Module */}
                <div className="flex flex-col items-center text-center pb-10 border-b border-white/5 mb-8">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-purple-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-2xl relative z-10 border border-white/20 transform group-hover:scale-105 transition-transform duration-500">
                      {user?.first_name?.[0]}
                      {user?.last_name?.[0]}
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-black text-white leading-tight tracking-tight">
                    {user?.first_name} <br /> {user?.last_name}
                  </h3>
                  <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-purple-400">
                    <Shield className="h-3 w-3" /> {userRole}
                  </div>
                </div>

                {/* Navigation Terminal */}
                <nav className="space-y-2 flex-grow">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-6 px-4 flex items-center gap-3">
                    <Terminal className="h-3 w-3" /> Personal Nexus
                  </p>
                  <div className="space-y-1.5">
                    {dashboardNavLinks
                      .filter((link) => !link.role || userRole === link.role)
                      .map((link) => {
                        const isActive = link.exact
                          ? location.pathname === link.href
                          : location.pathname.startsWith(link.href);
                        return (
                          <NavLink
                            key={link.name}
                            to={link.href}
                            end={link.exact}
                            className={`group flex items-center px-5 py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-500 ${
                              isActive
                                ? "bg-white text-slate-950 shadow-2xl shadow-white/10 -translate-y-1"
                                : "text-white/40 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <link.icon
                              className={`mr-4 h-5 w-5 transition-transform duration-500 group-hover:scale-110 ${
                                isActive
                                  ? "text-slate-950"
                                  : "text-white/20 group-hover:text-purple-400"
                              }`}
                            />
                            <span>{link.name}</span>
                          </NavLink>
                        );
                      })}
                  </div>
                </nav>

                {/* Status Indicator */}
                <div className="mt-auto pt-8 border-t border-white/5">
                  <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                        Node Online
                      </span>
                    </div>
                    <Activity className="h-3 w-3 text-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Integrated Workspace */}
          <main className="flex-grow w-full lg:max-w-[calc(100%-352px)]">
            <div className="bg-white p-8 sm:p-14 rounded-[4rem] shadow-2xl shadow-slate-200/60 border border-slate-100 min-h-[85vh] relative overflow-hidden">
              <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 pb-8 border-b border-slate-50">
                <div className="flex items-center gap-6">
                  <div className="bg-slate-950 p-4 rounded-[2rem] text-white shadow-3xl shadow-slate-950/20 group">
                    {currentLink ? (
                      <currentLink.icon className="h-8 w-8 group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <LayoutDashboard className="h-8 w-8" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        Subscriber Interface
                      </p>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-none lowercase">
                      {getTitle()}.
                    </h1>
                  </div>
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
