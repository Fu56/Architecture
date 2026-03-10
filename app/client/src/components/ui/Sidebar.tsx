import { Link, useLocation } from "react-router-dom";
import { useSession } from "../../lib/auth-client";
import {
  Home,
  Upload,
  LayoutDashboard,
  ShieldCheck,
  CheckCircle,
  Users,
  Flag,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

interface UserWithRole {
  id: string | number;
  email: string;
  name?: string;
  role?: { name: string } | string;
}

export default function Sidebar({ isOpen, setOpen }: SidebarProps) {
  const loc = useLocation();
  const { data: session } = useSession();
  const user = session?.user as UserWithRole | undefined;

  const closeSidebar = () => setOpen(false);

  const role =
    user && typeof user.role === "object" && user.role !== null
      ? user.role.name
      : user?.role;
  const isAdmin =
    role === "admin" ||
    role === "Admin" ||
    role === "SuperAdmin" ||
    role === "DepartmentHead";
  const isAuthorizedForApprovals =
    role === "SuperAdmin" || role === "DepartmentHead";

  const menuItems = [
    { name: "Browse", path: "/", icon: Home },
    {
      name: "Upload",
      path: isAdmin ? "/admin/upload" : "/dashboard/upload",
      icon: Upload,
    },
  ];

  const adminItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    ...(isAuthorizedForApprovals
      ? [{ name: "Resource Approvals", path: "/admin/approvals", icon: CheckCircle }]
      : []),
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Flags", path: "/admin/flags", icon: Flag },
  ];

  const isActive = (path: string) => loc.pathname === path;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-all duration-500"
          onClick={closeSidebar}
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-card border-r border-[#D9D9C2] dark:border-white/10 p-6 space-y-8 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500 ease-in-out md:relative md:translate-x-0 md:w-64 z-50 shadow-2xl md:shadow-none transition-colors duration-500`}
      >
        <div className="flex justify-between items-center md:hidden mb-8">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-[#DF8142]" />
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[#5A270F] dark:text-[#EEB38C]">
              MATRIX MENU
            </h2>
          </div>
          <button
            onClick={closeSidebar}
            title="Close Menu"
            className="p-2 bg-[#EFEDED] dark:bg-white/5 hover:bg-[#D9D9C2] dark:hover:bg-white/10 rounded-xl transition-colors text-[#5A270F]/60 dark:text-white/40"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </button>
        </div>

        <div className="space-y-1">
          <p className="px-4 text-[9px] font-black text-[#5A270F]/60 dark:text-white/30 uppercase tracking-[0.4em] mb-4">
            Intel Hub
          </p>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              onClick={closeSidebar}
              className={`flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                isActive(item.path)
                  ? "bg-[#5A270F] dark:bg-[#DF8142] text-white shadow-lg shadow-[#5A270F]/20 dark:shadow-none"
                  : "text-[#5A270F] dark:text-[#EEB38C] hover:bg-[#5A270F] dark:hover:bg-[#DF8142] hover:text-white hover:shadow-xl hover:shadow-[#5A270F]/10 dark:hover:shadow-none"
              }`}
              to={item.path}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`h-5 w-5 ${isActive(item.path) ? "text-white" : "text-[#92664A] dark:text-[#EEB38C]/60 group-hover:text-white"} transition-colors`} />
                <span className="text-sm font-bold tracking-tight">{item.name}</span>
              </div>
              {isActive(item.path) && <Sparkles className="h-3.5 w-3.5 text-white/40 animate-pulse" />}
            </Link>
          ))}
        </div>

        {isAdmin && (
          <div className="space-y-1 pt-6 border-t border-[#D9D9C2] dark:border-white/10">
            <p className="px-4 text-[9px] font-black text-[#DF8142] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
              <ShieldCheck className="h-3 w-3" /> Node Control
            </p>
            {adminItems.map((item) => (
              <Link
                key={item.path}
                onClick={closeSidebar}
                className={`flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive(item.path)
                    ? "bg-[#DF8142] dark:bg-[#EEB38C] text-white dark:text-[#5A270F] shadow-lg shadow-[#DF8142]/20 dark:shadow-none"
                    : "text-[#5A270F] dark:text-[#EEB38C] hover:bg-[#DF8142] dark:hover:bg-[#EEB38C] hover:text-white dark:hover:text-[#5A270F] hover:shadow-xl dark:hover:shadow-none"
                }`}
                to={item.path}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`h-5 w-5 ${isActive(item.path) ? "text-white" : "text-[#92664A] dark:text-[#EEB38C]/60 group-hover:text-white dark:group-hover:text-[#5A270F]"} transition-colors`} />
                  <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 bg-gradient-to-br from-[#5A270F] to-[#2A1205] dark:from-[#2A1205] dark:to-black rounded-2xl relative overflow-hidden group/card shadow-xl ring-1 ring-white/10">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#DF8142]/10 blur-2xl -translate-y-1/2 translate-x-1/2 transition-all group-hover/card:bg-[#DF8142]/20" />
            <div className="relative z-10">
              <p className="text-[8px] font-black text-[#DF8142] uppercase tracking-[0.4em] mb-1">
                Security Status
              </p>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-black text-white uppercase tracking-widest">
                  Encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
