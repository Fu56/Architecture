import { Outlet, NavLink } from "react-router-dom";
import {
  ShieldAlert,
  Users,
  Cpu,
  BarChart3,
  Globe,
  ExternalLink,
} from "lucide-react";

const SuperAdminDashboard = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-100px)] gap-8 animate-in fade-in duration-700">
      {/* Super Sidebar */}
      <aside className="w-full lg:w-80 flex flex-col gap-6">
        <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col gap-8 shadow-2xl shadow-slate-950/20">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 blur-3xl -translate-x-1/2 translate-y-1/2" />

          <div className="space-y-4 relative z-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">
              Core Authority
            </h2>
            <nav className="space-y-2">
              {[
                { to: "dept-heads", label: "Dept Heads", icon: Users },
                { to: "system-stats", label: "Subsystems", icon: Cpu },
                { to: "analytics", label: "Global Intel", icon: BarChart3 },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group ${
                      isActive
                        ? "bg-white text-slate-950 shadow-xl"
                        : "text-white/50 hover:bg-white/5 hover:text-white"
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
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-2">
              Master Override
            </h2>
            <nav className="space-y-2">
              {[
                { to: "/admin", label: "Admin Nexus", icon: Globe },
                { to: "/dashboard", label: "User Layer", icon: ExternalLink },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/50 hover:bg-white/5 hover:text-white transition-all"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-end min-h-[180px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-3xl" />
          <ShieldAlert className="h-4 w-4 mb-4 relative z-10 text-indigo-200" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] relative z-10">
            Security Protocol
          </p>
          <h3 className="text-xl font-black relative z-10">Developer Mode</h3>
        </div>
      </aside>

      {/* Main Content Node */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
