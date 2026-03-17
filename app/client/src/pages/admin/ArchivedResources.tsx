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
      <div className="relative overflow-hidden bg-[#5A270F] dark:bg-[#1A0B04] rounded-[2rem] p-6 lg:p-8 border border-white/5 shadow-xl shadow-[#5A270F]/20">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#EEB38C]/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute inset-0 architectural-dot-grid opacity-[0.03]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="h-[1.5px] w-6 bg-[#EEB38C]" />
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#EEB38C] drop-shadow-sm">
                CONTAINMENT ZONE
              </p>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tighter uppercase leading-none font-space-grotesk italic">
              SYSTEM <span className="text-[#EEB38C]">ARCHIVE</span>
            </h1>
            <p className="text-[9px] lg:text-[10px] text-[#EEB38C]/60 font-medium leading-relaxed max-w-lg uppercase tracking-wider">
              Secure vault for sequestered intelligence nodes. Only authorized personnel can restore nodes back to the active library.
            </p>
          </div>

          <div className="flex items-center gap-5 px-6 py-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg">
            <div className="h-10 w-10 rounded-xl bg-[#5A270F] border border-white/10 flex items-center justify-center text-white shadow-xl">
              <Archive className="h-5 w-5 text-[#EEB38C]" />
            </div>
            <div>
              <span className="text-2xl font-black text-white leading-none font-mono">
                {resources.length.toString().padStart(2, '0')}
              </span>
              <p className="text-[6px] font-black uppercase tracking-[0.3em] text-[#EEB38C]/60 mt-1 uppercase italic">
                Sequestered Units
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Archived Resources List ── */}
      {resources.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="group relative bg-[#FDFCFB] dark:bg-[#0F0602] rounded-[2rem] border border-[#BCAF9C]/20 dark:border-white/5 shadow-lg overflow-hidden hover:border-rose-500/30 transition-all duration-700"
            >
              <div className="absolute top-0 right-0 w-64 h-full bg-rose-500/5 blur-[80px] -z-10" />
              
              <div className="p-6 lg:p-8 lg:grid lg:grid-cols-12 gap-8">
                
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 bg-[#5A270F] text-[#EEB38C] text-[8px] font-black uppercase tracking-[0.2em] rounded-lg shadow-md border border-white/10">
                      SEQUESTERED PROTOCOL
                    </span>
                    <div className="flex items-center gap-1.5 text-[8px] text-[#92664A] dark:text-[#EEB38C]/60 font-black uppercase tracking-[0.3em]">
                      <Clock className="h-3 w-3 text-[#DF8142]" />
                      {new Date(resource.uploadedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  <Link
                    to={`/admin/resources/${resource.id}`}
                    className="block text-xl lg:text-2xl font-black text-[#5A270F] dark:text-white tracking-tighter leading-tight hover:text-rose-500 transition-all uppercase italic font-space-grotesk"
                  >
                    {resource.title}
                  </Link>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3 p-2.5 bg-[#6C3B1C]/5 dark:bg-white/5 rounded-xl border border-[#D9D9C2]/40 dark:border-white/10 group-hover:bg-white transition-all duration-500 shadow-sm">
                      <div className="h-8 w-8 bg-[#5A270F] text-[#EEB38C] rounded-lg flex items-center justify-center shadow-md">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[7px] font-black text-[#6C3B1C]/60 dark:text-[#EEB38C]/40 uppercase tracking-[0.3em] mb-0.5">AUTHORITY</p>
                        <p className="text-[10px] font-black text-[#5A270F] dark:text-white uppercase">
                          {(resource.uploader as any)?.firstName || (resource.uploader as any)?.first_name} {(resource.uploader as any)?.lastName || (resource.uploader as any)?.last_name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-2.5 bg-[#6C3B1C]/5 dark:bg-white/5 rounded-xl border border-[#D9D9C2]/40 dark:border-white/10">
                      <div className="h-8 w-8 bg-[#6C3B1C] text-[#EEB38C] rounded-lg flex items-center justify-center shadow-md">
                        <Database className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[7px] font-black text-[#6C3B1C]/60 dark:text-[#EEB38C]/40 uppercase tracking-[0.3em] mb-0.5">STATION</p>
                        <p className="text-[10px] font-black text-[#5A270F] dark:text-white uppercase">
                          {resource.designStage?.name || 'CORE'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vertical Center Action Side */}
                <div className="lg:col-span-4 flex flex-col gap-6 w-full lg:sticky lg:top-10">
                   <div className="bg-[#5A270F] dark:bg-black p-6 rounded-[2rem] border border-white/5 shadow-2xl shadow-[#5A270F]/30 space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#DF8142]/10 blur-3xl rounded-full" />
                      <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                        <Archive className="h-4 w-4 text-[#DF8142] animate-pulse" />
                        <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">CONTAINMENT STATUS</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center group/log">
                          <span className="text-[7px] font-black text-[#EEB38C]/50 uppercase tracking-widest text-rose-500">SEQUESTERED</span>
                          <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded-md text-[7px] font-black tracking-[0.1em] border border-rose-500/10">ACTIVE</span>
                        </div>
                        <div className="flex justify-between items-center group/log">
                          <span className="text-[7px] font-black text-[#EEB38C]/50 uppercase tracking-widest">ISOLATION</span>
                          <span className="text-[8px] font-black text-white block uppercase italic tracking-widest">LEVEL-MAX</span>
                        </div>
                      </div>
                   </div>

                   <div className="flex flex-col gap-2">
                      <a
                        href={`${import.meta.env.VITE_API_URL}/resources/${resource.id}/view?token=${encodeURIComponent(localStorage.getItem("token") || "")}`}
                        target="_blank" rel="noreferrer"
                        className="h-10 flex items-center justify-center gap-2 bg-white dark:bg-white/5 border border-[#BCAF9C]/20 dark:border-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-[#5A270F] dark:text-[#EEB38C] hover:bg-[#5A270F] hover:text-white transition-all shadow-md group/view"
                      >
                        <Eye className="h-4 w-4" /> INSPECT ARTIFACT
                      </a>

                      {isAuthorized ? (
                        <button
                          onClick={() => handleRestore(resource.id)}
                          className="h-10 w-full bg-[#5A270F] text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#DF8142] transition-all shadow-lg shadow-[#5A270F]/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> RESTORE LOGIC
                        </button>
                      ) : (
                        <div className="h-10 flex items-center justify-center gap-3 bg-amber-50 dark:bg-white/5 rounded-xl border border-amber-200 dark:border-white/10 opacity-50">
                          <ShieldAlert className="h-4 w-4 text-amber-600" />
                          <span className="text-[8px] font-black uppercase tracking-[0.15em] text-amber-900 dark:text-amber-400">Restricted Node</span>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center bg-[#FAF8F4] dark:bg-[#1A0B04] rounded-[3rem] border border-dashed border-[#D9D9C2] dark:border-white/10 transition-all duration-500 group shadow-inner">
           <div className="relative mb-10">
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#DF8142] blur-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative h-20 w-20 bg-[#5A270F] border border-[#EEB38C]/30 rounded-[2rem] flex items-center justify-center text-[#EEB38C] shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700 hover:scale-110">
                <ShieldAlert className="h-8 w-8" />
              </div>
          </div>
          <h3 className="text-3xl font-black text-[#5A270F] dark:text-white uppercase tracking-tighter italic">
            ARCHIVE <span className="text-[#EEB38C]">EMPTY</span>
          </h3>
          <p className="text-[#92664A] dark:text-[#EEB38C]/40 text-[9px] font-black uppercase tracking-[0.4em] mt-4 opacity-60">
            No active resources are currently sequestered.
          </p>
          <Link 
            to="/admin/resources"
            className="mt-10 flex items-center gap-3 px-8 py-4 bg-[#5A270F] text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all active:scale-95 shadow-xl"
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
