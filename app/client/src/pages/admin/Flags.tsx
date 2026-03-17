import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import type { Flag as FlagModel } from "../../models";
import {
  Loader2,
  Eye,
  Archive,
  ShieldCheck,
  Flag,
  User,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "../../lib/toast";
import { useSession } from "../../lib/auth-client";

const Flags = () => {
  const [flags, setFlags] = useState<FlagModel[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session } = useSession();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const user = session?.user as any;
  const role = typeof user?.role === "object" ? user.role.name : user?.role;
  const isDeptHead = role === "DepartmentHead" || role === "SuperAdmin";
  const isAdmin = role === "Admin";
  const isAuthorized = isDeptHead || isAdmin;

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/flags");
      if (data && Array.isArray(data.flags)) {
        setFlags(data.flags);
      }
    } catch (err) {
      console.error("Failed to fetch flags:", err);
      toast.error("Security Interface: Failed to synchronize breach reports");
    } finally {
      setLoading(false);
    }
  };

  const handleResolveFlag = async (flagId: number) => {
    setFlags((prev) => prev.filter((f) => f.id !== flagId));
    try {
      await api.patch(`/admin/flags/${flagId}/resolve`, { status: "resolved" });
      toast.success(isDeptHead ? "Security Alert dismissed" : "Resolution proposed");
    } catch (err) {
      console.error("Failed to resolve flag:", err);
      toast.error("Protocol Error: Failed to dismiss alert");
      fetchFlags();
    }
  };

  const handleArchiveResource = async (resourceId: number, flagId: number) => {
    setFlags((prev) => prev.filter((f) => f.id !== flagId));
    try {
      await api.patch(`/admin/resources/${resourceId}/archive`);
      await api.patch(`/admin/flags/${flagId}/resolve`, { status: "resolved" });
      toast.success(isDeptHead ? "Asset quarantined" : "Quarantine proposed");
    } catch (err) {
      console.error("Failed to archive resource:", err);
      toast.error("Security Breach: Failed to quarantine asset");
      fetchFlags();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6 animate-in fade-in duration-1000">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-2 border-[#DF8142]/10 border-t-[#DF8142] animate-spin" />
          <Loader2 className="absolute inset-0 m-auto h-6 w-6 text-[#DF8142] animate-pulse" />
        </div>
        <p className="text-[9px] font-black text-[#5A270F] dark:text-[#EEB38C]/40 uppercase tracking-[1em]">
          Scanning Protocols...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 animate-in slide-in-from-bottom-4 duration-1000">
      {/* ── Compact Security Header ── */}
      <div className="relative h-32 md:h-36 flex items-center px-8 lg:px-10 overflow-hidden bg-[#5A270F] rounded-[2rem] group border border-white/5 shadow-2xl shadow-[#5A270F]/20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5A270F] to-[#6C3B1C] transition-all duration-1000 group-hover:scale-105" />
        <div className="absolute right-0 top-0 w-2/3 h-full bg-gradient-to-l from-[#DF8142]/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] architectural-grid" />
        
        <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between items-start gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="h-[1.5px] w-6 bg-[#DF8142] shadow-[0_0_10px_#DF8142]" />
              <p className="text-[8px] font-black text-[#EEB38C] uppercase tracking-[0.5em]">SECURITY PROTOCOL</p>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight uppercase font-space-grotesk leading-none italic">
                VIOLATION <span className="text-[#DF8142]">MATRIX</span>
            </h1>
            <p className="text-[9px] lg:text-[10px] text-[#EEB38C]/60 font-medium max-w-lg leading-relaxed uppercase tracking-wider">
              Diagnostic overview of reported node breaches and asset integrity violations.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-2xl px-6 py-3 rounded-[1.5rem] border border-white/10 shadow-xl">
            <div className="relative">
              < ShieldAlert className="h-5 w-5 text-[#DF8142] relative z-10" />
            </div>
            <div>
              <span className="text-xl font-black text-white leading-none font-mono block">
                {flags.length.toString().padStart(2, '0')}
              </span>
              <p className="text-[6px] font-black text-[#EEB38C]/40 uppercase tracking-[0.4em] mt-0.5">ACTIVE BREACHES</p>
            </div>
          </div>
        </div>
      {flags.length > 0 ? (
        <div className="space-y-5">
          {flags.map((flag) => (
            <div
              key={flag.id}
              className="group relative bg-[#FDFCFB] dark:bg-[#0F0602] rounded-[2rem] border border-[#BCAF9C]/20 dark:border-white/5 shadow-lg overflow-hidden hover:border-[#DF8142]/40 transition-all duration-700"
            >
              <div className="absolute top-0 right-0 w-[200px] h-full bg-[#DF8142]/5 blur-3xl -z-10 transition-all duration-1000 group-hover:bg-[#DF8142]/10" />
              
              <div className="p-6 lg:p-8 lg:grid lg:grid-cols-12 gap-8">
                
                {/* ── Violation Metadata ── */}
                <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                   <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1 bg-[#5A270F] text-[#EEB38C] rounded-lg shadow-md border border-white/5 group/proto hover:-translate-y-0.5 transition-all">
                          <AlertTriangle className="h-3 w-3 animate-pulse text-[#DF8142]" />
                          <span className="text-[8px] font-black uppercase tracking-[0.1em]">
                            URGENT REVIEW <span className="text-white/40 italic ml-2">VIOL-0{flag.id % 9 + 1}</span>
                          </span>
                        </div>
                        {flag.status === "admin_resolved" && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded-md text-[7px] font-black uppercase tracking-widest border border-emerald-500/10">
                            <ShieldCheck className="h-2.5 w-2.5" /> PRE-RESOLVED
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 text-[7px] text-[#5A270F]/50 dark:text-[#EEB38C]/40 font-black uppercase tracking-[0.2em]">
                          <Clock className="h-3 w-3 text-[#DF8142]" />
                          {new Date(flag.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>

                      <Link
                        to={`/admin/resources/${flag.resourceId}`}
                        className="block text-xl lg:text-2xl font-black text-[#5A270F] dark:text-[#EEB38C] tracking-tight leading-tight hover:text-[#DF8142] transition-colors font-space-grotesk uppercase italic"
                      >
                        {flag.resource.title}
                      </Link>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-3 p-2.5 bg-[#6C3B1C]/5 dark:bg-white/5 rounded-xl border border-[#6C3B1C]/10 dark:border-white/10 group/item hover:bg-white dark:hover:bg-[#1A0B04] transition-all duration-500 shadow-sm">
                          <div className="h-7 w-7 bg-[#5A270F] text-[#EEB38C] rounded-md flex items-center justify-center shadow-lg group-hover/item:scale-105 transition-transform">
                            <User className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="text-[6px] font-black text-[#6C3B1C]/60 dark:text-[#EEB38C]/40 uppercase tracking-[0.3em] mb-0.5">SOURCE</p>
                            <p className="text-[9px] font-black text-[#5A270F] dark:text-white uppercase tracking-tight">
                              {(flag.resource.uploader as any)?.firstName} {(flag.resource.uploader as any)?.lastName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-2.5 bg-[#6C3B1C]/5 dark:bg-white/5 rounded-xl border border-[#6C3B1C]/10 dark:border-white/10 group/item hover:bg-white dark:hover:bg-[#1A0B04] transition-all duration-500 shadow-sm">
                          <div className="h-7 w-7 bg-[#6C3B1C] text-[#EEB38C] rounded-md flex items-center justify-center shadow-lg group-hover/item:scale-105 transition-transform">
                            <Flag className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="text-[6px] font-black text-[#6C3B1C]/60 dark:text-[#EEB38C]/40 uppercase tracking-[0.3em] mb-0.5">REPORTER</p>
                            <p className="text-[9px] font-black text-[#5A270F] dark:text-white uppercase tracking-tight">
                              {(flag.reporter as any)?.firstName} {(flag.reporter as any)?.lastName}
                            </p>
                          </div>
                        </div>
                      </div>
                   </div>

                   {/* Violation Abstract */}
                   <div className="pt-4 border-t border-[#BCAF9C]/20 dark:border-white/10 space-y-3">
                      <p className="text-[8px] font-black text-[#5A270F] dark:text-[#EEB38C] uppercase tracking-[0.5em] flex items-center gap-2">
                        <Zap className="h-3 w-3 text-[#DF8142]" /> EVIDENCE ABSTRACT
                      </p>
                      <div className="w-full px-4 py-3 bg-[#6C3B1C]/5 dark:bg-white/5 border border-[#BCAF9C]/10 dark:border-white/5 rounded-xl">
                        <p className="text-[10px] font-bold text-[#5A270F] dark:text-white/80 leading-relaxed italic uppercase tracking-wider">
                          "{flag.reason || "AUTOMATIC DETECTION SIGNAL: NO REASON PROVIDED."}"
                        </p>
                      </div>
                   </div>
                </div>

                {/* ── Compact Control Side ── */}
                <div className="lg:col-span-4 mt-6 lg:mt-0 flex flex-col gap-4 lg:sticky lg:top-10">
                   <div className="bg-[#5A270F] dark:bg-black p-6 rounded-[2rem] border border-white/5 shadow-2xl shadow-[#5A270F]/30 space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#DF8142]/10 blur-3xl rounded-full" />
                      <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                        <ShieldAlert className="h-4 w-4 text-[#DF8142] animate-pulse" />
                        <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">SECURITY STATUS</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[7px] font-black text-[#EEB38C]/50 uppercase tracking-widest">THREAT LVL</span>
                          <span className="px-2 py-0.5 bg-[#EEB38C]/10 text-[#EEB38C] rounded-md text-[7px] font-black tracking-[0.1em] border border-[#EEB38C]/20">ELEVATED</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[7px] font-black text-[#EEB38C]/50 uppercase tracking-widest">DIAGNOSTIC</span>
                          <span className="text-[8px] font-black text-white block uppercase italic tracking-widest">RECO-PENDING</span>
                        </div>
                      </div>
                   </div>

                   <div className="flex flex-col gap-2">
                      <Link
                        to={`/admin/resources/${flag.resourceId}`}
                        className="h-10 flex items-center justify-center gap-2.5 bg-white dark:bg-white/5 border border-[#BCAF9C]/20 dark:border-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-[#5A270F] dark:text-[#EEB38C] hover:bg-[#5A270F] hover:text-white transition-all shadow-md group/view"
                      >
                        <Eye className="h-4 w-4" /> INSPECT NODE
                      </Link>

                      {isAuthorized && (
                        <div className="grid grid-cols-2 gap-2 h-10">
                           <button
                             onClick={() => handleArchiveResource(flag.resourceId, flag.id)}
                             className="bg-[#92664A] text-white text-[8px] font-black uppercase tracking-[0.1em] rounded-xl hover:bg-[#DF8142] transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                           >
                             <Archive className="h-3.5 w-3.5" /> {isDeptHead ? "QUARANTINE" : "PROPOSE"}
                           </button>
                           <button
                             onClick={() => handleResolveFlag(flag.id)}
                             className="bg-[#5A270F] text-white text-[8px] font-black uppercase tracking-[0.1em] rounded-xl hover:bg-[#6C3B1C] transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#5A270F]/20 active:scale-95"
                           >
                             <ShieldCheck className="h-3.5 w-3.5" /> {isDeptHead ? "RESOLVE" : "PRE-RES"}
                           </button>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center bg-[#FDFCFB] dark:bg-[#1A0B04] rounded-[3rem] border-2 border-dashed border-[#BCAF9C]/20 relative overflow-hidden group">
           <div className="absolute inset-0 architectural-dot-grid opacity-5" />
           <div className="relative mb-12">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#DF8142] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="h-24 w-24 bg-[#5A270F] rounded-[2.5rem] flex items-center justify-center text-[#EEB38C] shadow-2xl shadow-[#5A270F]/40 rotate-12 group-hover:rotate-0 transition-all duration-1000 border-2 border-white/5">
                <ShieldCheck className="h-10 w-10" />
              </div>
           </div>
           <h3 className="text-3xl lg:text-5xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter italic font-space-grotesk text-center">
             SECURITY <br/> <span className="text-[#DF8142]">PERIMETER CLEAR</span>
           </h3>
           <p className="text-[#92664A] dark:text-[#EEB38C]/40 text-[9px] font-black uppercase tracking-[0.6em] mt-8 text-center text-opacity-60">
             NO ACTIVE VIOLATIONS DETECTED
           </p>
           <Link 
             to="/admin/resources"
             className="mt-12 flex items-center gap-4 px-10 py-5 bg-[#5A270F] text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#6C3B1C] hover:scale-105 transition-all shadow-xl shadow-[#5A270F]/30"
           >
             RETURN TO DATABASE
             <ArrowRight className="h-4 w-4" />
           </Link>
        </div>
      )}
    </div>
  );
};

export default Flags;
