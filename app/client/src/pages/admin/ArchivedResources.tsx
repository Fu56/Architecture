import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import type { Resource } from "../../models";
import {
  Loader2,
  Eye,
  RotateCcw,
  Archive,
  Clock,
  User,
  ShieldAlert,
  ArrowRight,
  Database
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "../../lib/toast";

import { useSession } from "../../lib/auth-client";

const ArchivedResources = () => {
  const { data: session } = useSession();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const user = session?.user as any;
  const role = typeof user?.role === "object" ? user.role.name : user?.role;
  const isAuthorized = role === "DepartmentHead" || role === "SuperAdmin";

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArchivedResources();
  }, []);

  const fetchArchivedResources = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/resources/archived");
      if (Array.isArray(data)) {
        setResources(data);
      }
    } catch (err) {
      console.error("Failed to fetch archived resources:", err);
      toast.error("Protocol Error: Failed to synchronize archive registry");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (resourceId: number) => {
    const previousResources = [...resources];
    setResources(resources.filter((r) => r.id !== resourceId));
    try {
      await api.patch(`/admin/resources/${resourceId}/restore`);
      toast.success("Asset restored successfully to the active matrix");
    } catch (err) {
      console.error(`Failed to restore asset:`, err);
      toast.error(`Protocol Breach: Failed to restore asset`);
      setResources(previousResources);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-8 animate-in fade-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-[#DF8142] blur-3xl opacity-20 animate-pulse" />
          <Loader2 className="h-20 w-20 animate-spin text-[#DF8142] relative z-10" />
        </div>
        <p className="text-[11px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.6em] animate-pulse">
          Accessing System Archive...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 pb-20">
      {/* ── Archive Hero ── */}
      <div className="relative overflow-hidden bg-[#5A270F] dark:bg-[#1A0B04] rounded-[4rem] p-12 lg:p-16 border border-white/10 shadow-[0_50px_100px_-20px_rgba(90,39,15,0.4)]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EEB38C]/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute inset-0 architectural-dot-grid opacity-10" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-10 bg-[#EEB38C]" />
              <p className="text-[11px] font-black uppercase tracking-[0.6em] text-[#EEB38C] drop-shadow-sm">
                Containment Zone
              </p>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9] font-space-grotesk italic">
              SYSTEM <span className="text-[#EEB38C]">ARCHIVE</span>
            </h1>
            <p className="text-base text-[#EEB38C]/60 font-medium leading-relaxed max-w-lg">
              Secure vault for sequestered intelligence nodes. Only authorized personnel can restore nodes back to the active library.
            </p>
          </div>

          <div className="flex items-center gap-6 px-10 py-6 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl">
            <div className="h-16 w-16 rounded-2xl bg-[#5A270F] border border-white/20 flex items-center justify-center text-white shadow-2xl shadow-black/50">
              <Archive className="h-8 w-8 text-[#EEB38C]" />
            </div>
            <div>
              <span className="text-4xl font-black text-white leading-none font-mono">
                {resources.length.toString().padStart(2, '0')}
              </span>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#EEB38C]/60 mt-1 uppercase italic">
                Sequestered Units
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Archived Resources List ── */}
      {resources.length > 0 ? (
        <div className="grid grid-cols-1 gap-12">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="group relative bg-white dark:bg-card/50 backdrop-blur-3xl rounded-[4rem] border border-[#D9D9C2]/60 dark:border-white/5 shadow-2xl shadow-[#5A270F]/5 overflow-hidden transition-all duration-700 hover:shadow-[0_40px_80px_-20px_rgba(90,39,15,0.15)]"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-rose-500/5 to-transparent blur-[100px] transition-all duration-1000 group-hover:from-rose-500/10" />
              
              <div className="p-10 lg:p-14 relative z-10 flex flex-col lg:grid lg:grid-cols-12 gap-12 items-start">
                
                <div className="lg:col-span-8 space-y-8">
                  <div className="flex flex-wrap items-center gap-6">
                    <span className="px-5 py-2 bg-rose-900 text-rose-200 text-[10px] font-black uppercase tracking-[0.3em] rounded-xl shadow-xl shadow-rose-900/20">
                      SEQUESTERED PROTOCOL
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-[#92664A] dark:text-[#EEB38C]/60 font-black uppercase tracking-[0.4em]">
                      <Clock className="h-4 w-4" />
                      Asset Born: {new Date(resource.uploadedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  <Link
                    to={`/admin/resources/${resource.id}`}
                    className="block text-4xl lg:text-5xl font-black text-[#5A270F] dark:text-white tracking-tighter leading-[0.9] hover:text-[#DF8142] transition-all uppercase italic font-space-grotesk"
                  >
                    {resource.title}
                  </Link>

                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-4 p-4 bg-[#FAF8F4] dark:bg-white/5 rounded-[1.75rem] border border-[#D9D9C2]/40 dark:border-white/10 group-hover:bg-white transition-all duration-500">
                      <div className="h-12 w-12 bg-white dark:bg-[#1A0B04] border border-[#D9D9C2]/50 dark:border-white/10 rounded-2xl flex items-center justify-center text-[#DF8142] shadow-xl">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] mb-1">Origin Authority</p>
                        <p className="text-sm font-black text-[#5A270F] dark:text-white">
                          {(resource.uploader as any)?.firstName || (resource.uploader as any)?.first_name} {(resource.uploader as any)?.lastName || (resource.uploader as any)?.last_name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-[#FAF8F4] dark:bg-white/5 rounded-[1.75rem] border border-[#D9D9C2]/40 dark:border-white/10">
                      <div className="h-12 w-12 bg-white dark:bg-[#1A0B04] border border-[#D9D9C2]/50 dark:border-white/10 rounded-2xl flex items-center justify-center text-[#92664A] shadow-xl">
                        <Database className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-[#92664A] dark:text-[#EEB38C]/40 uppercase tracking-[0.4em] mb-1">Design Phase</p>
                        <p className="text-sm font-black text-[#5A270F] dark:text-white">
                          {resource.designStage?.name || 'Protocol-01'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vertical Center Action Side */}
                <div className="lg:col-span-4 flex flex-col gap-6 w-full lg:sticky lg:top-12">
                   <a
                    href={`${import.meta.env.VITE_API_URL}/resources/${resource.id}/view?token=${encodeURIComponent(localStorage.getItem("token") || "")}`}
                    target="_blank" rel="noreferrer"
                    className="h-20 flex items-center justify-center gap-4 bg-white dark:bg-white/5 border-2 border-[#D9D9C2]/60 dark:border-white/10 text-[11px] font-black uppercase tracking-[0.4em] rounded-[2rem] text-[#5A270F] dark:text-white hover:border-[#DF8142] hover:text-[#DF8142] transition-all active:scale-95 shadow-2xl"
                  >
                    <Eye className="h-6 w-6" /> Inspect Artifact
                  </a>

                  {isAuthorized ? (
                    <div className="flex h-20">
                      <button
                        onClick={() => handleRestore(resource.id)}
                        className="w-full h-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-[12px] font-black uppercase tracking-[0.2em] rounded-[2rem] hover:bg-emerald-500 hover:text-white transition-all shadow-xl shadow-emerald-500/10 active:scale-95 flex items-center justify-center gap-3"
                      >
                        <RotateCcw className="h-5 w-5" /> Restore Logic
                      </button>
                    </div>
                  ) : (
                    <div className="h-20 flex items-center justify-center gap-4 bg-amber-50 dark:bg-amber-950/20 rounded-[2rem] border-2 border-amber-200 dark:border-amber-900/30">
                      <ShieldAlert className="h-6 w-6 text-amber-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-900 dark:text-amber-400">Node Locked</span>
                    </div>
                  )}
                  
                  <div className="bg-[#FAF8F4] dark:bg-black p-8 rounded-[2.5rem] border border-[#D9D9C2]/40 dark:border-white/10 space-y-4">
                     <p className="text-[9px] font-black text-[#92664A] dark:text-white/20 uppercase tracking-[0.4em] flex items-center gap-3">
                       <Archive className="h-4 w-4" /> Containment Status
                     </p>
                     <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#5A270F] dark:text-white/60">
                         <span>Structural State</span>
                         <span className="text-rose-500">Archived</span>
                       </div>
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#5A270F] dark:text-white/60">
                         <span>Isolation Level</span>
                         <span>Maximum</span>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-40 flex flex-col items-center justify-center bg-[#FAF8F4] dark:bg-[#1A0B04] rounded-[4rem] border border-dashed border-[#D9D9C2] dark:border-white/10 transition-all duration-500 group shadow-inner">
           <div className="relative mb-12">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#DF8142] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative h-28 w-28 bg-[#5A270F] border border-[#EEB38C]/30 rounded-[2.5rem] flex items-center justify-center text-[#EEB38C] shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700 hover:scale-110">
                <ShieldAlert className="h-12 w-12" />
              </div>
          </div>
          <h3 className="text-4xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter italic">
            ARCHIVE <span className="text-[#EEB38C]">EMPTY</span>
          </h3>
          <p className="text-[#92664A] dark:text-[#EEB38C]/40 text-[11px] font-black uppercase tracking-[0.5em] mt-6 opacity-60">
            No active resources are currently sequestered.
          </p>
          <Link 
            to="/admin/resources"
            className="mt-12 flex items-center gap-4 px-12 py-5 bg-[#5A270F] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-110 transition-all active:scale-95 shadow-2xl"
          >
            Review Active Database
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
      
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[#5A270F]/10 dark:via-[#EEB38C]/10 to-transparent" />
    </div>
  );
};

export default ArchivedResources;
