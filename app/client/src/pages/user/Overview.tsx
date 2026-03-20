import { getUser } from "../../lib/auth";
import {
  Upload,
  CheckCircle,
  Bell,
  ArrowRight,
  Activity,
  Cpu,
  Box,
  ShieldCheck,
  CheckSquare,
  Flag,
  Users,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSession } from "../../lib/auth-client";

interface UserPermissions {
  canApproveResources?: boolean;
  canResolveFlags?: boolean;
  canEditUsers?: boolean;
  canDeleteNodes?: boolean;
}

interface SessionUser {
  permissions?: UserPermissions;
  [key: string]: unknown;
}

const Overview = () => {
  const user = getUser();
  const { data: session } = useSession();
  const name = user?.first_name || "Architect";

  // Pull permissions from live session for accuracy
  const sessionUser = session?.user as SessionUser | undefined;
  const permissions: UserPermissions = (sessionUser?.permissions as UserPermissions) || {};

  // Build the list of delegated tasks this user is authorized to perform
  const delegatedActions = [
    permissions.canApproveResources && {
      id: "approve",
      label: "Resource Approval",
      description: "Review and approve or reject pending architectural resource submissions.",
      href: "/dashboard/authority",
      icon: CheckSquare,
      color: "#059669",
      bg: "bg-emerald-500",
      border: "border-emerald-200 dark:border-emerald-900/60",
      cardBg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    permissions.canResolveFlags && {
      id: "flags",
      label: "Flag Resolution",
      description: "Investigate and resolve flagged resources reported by users.",
      href: "/dashboard/authority",
      icon: Flag,
      color: "#dc2626",
      bg: "bg-red-500",
      border: "border-red-200 dark:border-red-900/60",
      cardBg: "bg-red-50 dark:bg-red-950/30",
    },
    permissions.canEditUsers && {
      id: "users",
      label: "User Authorization",
      description: "Manage user accounts, roles, and access rights in the registry.",
      href: "/dashboard/authority",
      icon: Users,
      color: "#7c3aed",
      bg: "bg-violet-600",
      border: "border-violet-200 dark:border-violet-900/60",
      cardBg: "bg-violet-50 dark:bg-violet-950/30",
    },
  ].filter(Boolean) as {
    id: string;
    label: string;
    description: string;
    href: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
    cardBg: string;
  }[];

  const hasAuthority = delegatedActions.length > 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Section - Executive Style */}
      <div className="bg-[#5A270F] dark:bg-[#1A0B02] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden group transition-colors duration-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#DF8142]/20 blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#DF8142]/30 transition-all duration-1000" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#6C3B1C]/20 blur-[60px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 opacity-[0.05] architectural-grid pointer-events-none" />
 
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 border border-white/10 rounded-full text-[8.5px] font-black uppercase tracking-[0.2em] text-[#EEB38C] mb-4">
              <Cpu className="h-3 w-3" /> Core Status: Nominal
            </div>
            <h2 className="text-3xl sm:text-4xl font-black mb-3 tracking-tighter leading-none italic uppercase">
              Greetings, <br />
              <span className="text-[#DF8142] not-italic">
                {name}.
              </span>
            </h2>
            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest leading-relaxed max-w-xs">
              Synchronizing neural interface with the global nexus nodes. Authentication successful.
            </p>
          </div>
 
          <div className="flex gap-3">
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center min-w-[100px] transition-colors">
              <div className="text-xl font-black text-[#DF8142]">04</div>
              <div className="text-[7.5px] font-black text-white/40 uppercase tracking-widest mt-1">
                Tasks
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center min-w-[100px] transition-colors">
              <div className="text-xl font-black text-[#EEB38C]">12</div>
              <div className="text-[7.5px] font-black text-white/40 uppercase tracking-widest mt-1">
                Assets
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Authority Mandate Panel ─────────────────────────────────────── */}
      {hasAuthority && (
        <div className="rounded-3xl border-2 border-violet-300 dark:border-violet-800/60 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/40 dark:to-indigo-950/30 p-6 sm:p-8 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-700 shadow-lg shadow-violet-500/10">
          {/* Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-violet-400/20 blur-[80px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/10 blur-[60px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black uppercase tracking-tight text-violet-900 dark:text-violet-200">
                    Authority Mandate
                  </h3>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-violet-500/15 border border-violet-400/30 rounded-full">
                    <Zap className="h-2.5 w-2.5 text-violet-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-violet-600 dark:text-violet-400">
                      Active
                    </span>
                  </span>
                </div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-violet-500/70 mt-0.5">
                  Delegated by Department Head · {delegatedActions.length} task{delegatedActions.length > 1 ? "s" : ""} authorized
                </p>
              </div>
            </div>

            {/* Task Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {delegatedActions.map((action) => (
                <Link
                  key={action.id}
                  to={action.href}
                  className={`group relative flex flex-col gap-4 p-5 rounded-2xl border-2 ${action.border} ${action.cardBg} hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 overflow-hidden`}
                >
                  {/* BG icon watermark */}
                  <div className="absolute bottom-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <action.icon className="h-16 w-16" style={{ color: action.color }} />
                  </div>

                  <div className="relative z-10 flex items-start gap-3">
                    <div
                      className={`h-9 w-9 rounded-xl ${action.bg} flex items-center justify-center shadow-md shrink-0 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 mb-1" style={{ color: action.color }}>
                        Granted Access
                      </p>
                      <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight leading-tight">
                        {action.label}
                      </h4>
                    </div>
                  </div>

                  <p className="relative z-10 text-[10px] font-bold leading-relaxed text-slate-600 dark:text-slate-400">
                    {action.description}
                  </p>

                  <div className="relative z-10 flex items-center gap-1.5 mt-auto" style={{ color: action.color }}>
                    <span className="text-[8px] font-black uppercase tracking-widest">Execute Task</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Action Card: Upload */}
        <Link
          to="/dashboard/upload"
          className="group relative bg-white dark:bg-[#1A0B02] p-8 rounded-3xl border border-[#D9D9C2] dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-[#5A270F]/10 dark:hover:shadow-none transition-all duration-500 hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 text-[#DF8142]/5 group-hover:text-[#DF8142]/10 transition-colors">
            <Box className="h-24 w-24" />
          </div>
          <div className="relative z-10">
            <div className="p-3 bg-[#DF8142] text-white rounded-xl w-fit shadow-lg mb-6 group-hover:scale-110 transition-transform">
              <Upload className="h-5 w-5" />
            </div>
            <p className="text-[8.5px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.2em] mb-2 transition-colors">
              Protocol: Upload
            </p>
            <h3 className="text-xl font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-tight mb-3 transition-colors">
              Asset Deploy
            </h3>
            <p className="text-[#6C3B1C] dark:text-[#EEB38C]/60 text-xs font-bold leading-relaxed mb-6 transition-colors">
              Integrate new architectural artifacts into the nexus.
            </p>
            <div className="flex items-center gap-2 text-[8px] font-black text-[#DF8142] uppercase tracking-widest">
              Begin Transmission{" "}
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Action Card: Archives */}
        <Link
          to="/dashboard/uploads"
          className="group relative bg-white dark:bg-[#1A0B02] p-8 rounded-3xl border border-[#D9D9C2] dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-[#5A270F]/10 dark:hover:shadow-none transition-all duration-500 hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 text-[#5A270F] dark:text-[#EEB38C]/5 group-hover:text-[#5A270F] dark:text-[#EEB38C]/10 transition-colors">
            <Activity className="h-24 w-24" />
          </div>
          <div className="relative z-10">
            <div className="p-3 bg-[#5A270F] text-white rounded-xl w-fit shadow-lg mb-6 group-hover:scale-110 transition-transform">
              <CheckCircle className="h-5 w-5" />
            </div>
            <p className="text-[8.5px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.2em] mb-2 transition-colors">
              Protocol: Index
            </p>
            <h3 className="text-xl font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-tight mb-3 transition-colors">
              My Records
            </h3>
            <p className="text-[#6C3B1C] dark:text-[#EEB38C]/60 text-xs font-bold leading-relaxed mb-6 transition-colors">
              Monitor verification status and manage assets.
            </p>
            <div className="flex items-center gap-2 text-[8px] font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-widest transition-colors">
              Access History{" "}
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </Link>

        {/* Action Card: Signals */}
        <Link
          to="/dashboard/notifications"
          className="group relative bg-white dark:bg-[#1A0B02] p-8 rounded-3xl border border-[#D9D9C2] dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-[#5A270F]/10 dark:hover:shadow-none transition-all duration-500 hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-6 text-[#6C3B1C] dark:text-[#EEB38C]/10 group-hover:text-[#6C3B1C] dark:text-[#EEB38C]/20 transition-colors">
            <Bell className="h-24 w-24" />
          </div>
          <div className="relative z-10">
            <div className="p-3 bg-[#6C3B1C] text-white rounded-xl w-fit shadow-lg mb-6 group-hover:scale-110 transition-transform">
              <Bell className="h-5 w-5" />
            </div>
            <p className="text-[8.5px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.2em] mb-2 transition-colors">
              Protocol: Update
            </p>
            <h3 className="text-xl font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-tight mb-3 transition-colors">
              Signals
            </h3>
            <p className="text-[#6C3B1C] dark:text-[#EEB38C]/60 text-xs font-bold leading-relaxed mb-6 transition-colors">
              Stay synchronized with peer-reviews and alerts.
            </p>
            <div className="flex items-center gap-2 text-[8px] font-black text-[#6C3B1C] dark:text-[#EEB38C] uppercase tracking-widest transition-colors">
              Monitor Stream{" "}
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Overview;


