// AUTHORITY_MANDATE_HUB_v1
import { useState } from "react";
import {
  CheckSquare, Flag, Users, Zap, ArrowRight,
  ChevronRight, Lock,
} from "lucide-react";
import { useSession } from "../../lib/auth-client";
import { useTheme } from "../../context/useTheme";
import Approvals from "../admin/Approvals";
import Flags from "../admin/Flags";
import ManageUsers from "../admin/ManageUsers";

interface SessionWithPerms {
  permissions?: {
    canApproveResources?: boolean;
    canResolveFlags?: boolean;
    canEditUsers?: boolean;
    canDeleteNodes?: boolean;
  };
}

type TabId = "approve" | "flags" | "users";

const tabs = [
  {
    id: "approve" as TabId,
    label: "Resource Approvals",
    shortLabel: "Approvals",
    icon: CheckSquare,
    desc: "Review and approve or reject pending resource submissions.",
    permKey: "canApproveResources" as const,
    color: "emerald",
    activeClass: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30",
    inactiveClass: "text-emerald-400/70 hover:bg-emerald-500/10 hover:text-emerald-300",
    dotClass: "bg-emerald-400",
    borderClass: "border-emerald-500/30",
  },
  {
    id: "flags" as TabId,
    label: "Flag Resolution",
    shortLabel: "Flags",
    icon: Flag,
    desc: "Investigate and resolve flagged resources reported by users.",
    permKey: "canResolveFlags" as const,
    color: "red",
    activeClass: "bg-red-500 text-white shadow-lg shadow-red-500/30",
    inactiveClass: "text-red-400/70 hover:bg-red-500/10 hover:text-red-300",
    dotClass: "bg-red-400",
    borderClass: "border-red-500/30",
  },
  {
    id: "users" as TabId,
    label: "User Authorization",
    shortLabel: "Users",
    icon: Users,
    desc: "Manage user accounts, roles, and access rights in the registry.",
    permKey: "canEditUsers" as const,
    color: "violet",
    activeClass: "bg-violet-600 text-white shadow-lg shadow-violet-500/30",
    inactiveClass: "text-violet-400/70 hover:bg-violet-500/10 hover:text-violet-300",
    dotClass: "bg-violet-400",
    borderClass: "border-violet-500/30",
  },
];

const AuthorityMandate = () => {
  const { data: session } = useSession();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const sessionUser = session?.user as SessionWithPerms | undefined;
  const perms = sessionUser?.permissions || {};

  // Filter tabs to only the ones the user is authorized for
  const grantedTabs = tabs.filter((t) => perms[t.permKey] === true);

  const [activeTab, setActiveTab] = useState<TabId | null>(
    grantedTabs[0]?.id ?? null
  );

  const activeTabDef = tabs.find((t) => t.id === activeTab);

  if (grantedTabs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 animate-in fade-in duration-700">
        <div className={`h-20 w-20 rounded-[2rem] flex items-center justify-center border-2 border-dashed ${isLight ? "border-slate-200 bg-slate-50" : "border-white/10 bg-white/5"}`}>
          <Lock className="h-8 w-8 text-slate-400" />
        </div>
        <div className="text-center space-y-2">
          <h3 className={`text-xl font-black uppercase tracking-tight ${isLight ? "text-[#5A270F]" : "text-white"}`}>
            No Authority Granted
          </h3>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${isLight ? "text-[#92664A]" : "text-white/40"}`}>
            Contact your Department Head to be assigned tasks.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ─── Hero Banner ───────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-violet-800 to-indigo-900 p-6 sm:p-8 shadow-2xl shadow-violet-900/40 border border-violet-500/20">
        {/* Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-400/20 blur-[80px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 blur-[60px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.04] architectural-grid pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Label row */}
            <div className="flex items-center gap-2.5">
              <span className="h-[1.5px] w-6 bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.8)]" />
              <p className="text-[8.5px] font-black text-violet-300 uppercase tracking-[0.5em]">
                Delegated by Department Head
              </p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase leading-none italic">
              Authority <span className="text-violet-300 not-italic">Mandate</span>
            </h1>
            <p className="text-[9.5px] text-violet-200/60 font-bold uppercase tracking-wider max-w-md leading-relaxed">
              Your delegated tasks are active. Select a module below to begin executing your assigned responsibilities.
            </p>
          </div>

          {/* Permission badges */}
          <div className="flex flex-wrap gap-2 shrink-0">
            {grantedTabs.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm"
              >
                <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${t.dotClass}`} />
                <t.icon className="h-3 w-3 text-white/60" />
                <span className="text-[8px] font-black text-white/80 uppercase tracking-widest">{t.shortLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Tab Bar ─────────────────────────────────────────────────── */}
      <div className={`flex gap-2 p-1.5 rounded-2xl border ${isLight ? "bg-slate-50 border-slate-200" : "bg-white/5 border-white/10"}`}>
        {grantedTabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[9.5px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                isActive ? t.activeClass : t.inactiveClass
              }`}
            >
              <t.icon className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">{t.shortLabel}</span>
              {isActive && <ChevronRight className="h-3 w-3 ml-1 hidden sm:inline" />}
            </button>
          );
        })}
      </div>

      {/* ─── Active Tab Description Strip ─────────────────────────── */}
      {activeTabDef && (
        <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 ${activeTabDef.borderClass} ${isLight ? "bg-white" : "bg-white/5"} animate-in fade-in duration-300`}>
          <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${activeTabDef.activeClass} shrink-0`}>
            <activeTabDef.icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-[9px] font-black uppercase tracking-[0.2em] opacity-50 ${isLight ? "text-slate-800" : "text-white"}`}>
              Active Module
            </p>
            <h3 className={`text-sm font-black uppercase tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}>
              {activeTabDef.label}
            </h3>
          </div>
          <p className={`text-[9px] font-bold hidden md:block max-w-xs text-right leading-relaxed ${isLight ? "text-slate-500" : "text-white/40"}`}>
            {activeTabDef.desc}
          </p>
          <ArrowRight className={`h-4 w-4 shrink-0 ${isLight ? "text-slate-300" : "text-white/20"}`} />
        </div>
      )}

      {/* ─── Locked Tabs Notice ───────────────────────────────────── */}
      {tabs.filter((t) => !grantedTabs.find((g) => g.id === t.id)).length > 0 && (
        <div className={`flex flex-wrap gap-2 items-center px-4 py-2.5 rounded-xl border border-dashed ${isLight ? "border-slate-200 bg-slate-50/50" : "border-white/10 bg-white/5"}`}>
          <Lock className="h-3 w-3 text-slate-400 shrink-0" />
          <span className={`text-[8px] font-black uppercase tracking-widest ${isLight ? "text-slate-400" : "text-white/30"}`}>
            Not Granted:
          </span>
          {tabs
            .filter((t) => !grantedTabs.find((g) => g.id === t.id))
            .map((t) => (
              <span
                key={t.id}
                className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${isLight ? "bg-slate-100 text-slate-400" : "bg-white/5 text-white/20"}`}
              >
                {t.shortLabel}
              </span>
            ))}
        </div>
      )}

      {/* ─── Task Panel ──────────────────────────────────────────────── */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === "approve" && perms.canApproveResources && <Approvals />}
        {activeTab === "flags"   && perms.canResolveFlags     && <Flags />}
        {activeTab === "users"   && perms.canEditUsers        && <ManageUsers />}
      </div>

      {/* ─── Powered by footer ───────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 py-4 opacity-30">
        <Zap className="h-3 w-3 text-violet-400" />
        <span className={`text-[8px] font-black uppercase tracking-[0.4em] ${isLight ? "text-[#5A270F]" : "text-white"}`}>
          Authority Mandate · Delegated Protocol
        </span>
      </div>
    </div>
  );
};

export default AuthorityMandate;
